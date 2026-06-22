import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FoodItemSchema } from '@/types/food';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

const ContributionPayloadSchema = z.object({
  entry: FoodItemSchema,
  submitterNotes: z.string().max(500).optional(),
});

function buildIssueBody(payload: z.infer<typeof ContributionPayloadSchema>, submittedAt: string): string {
  const lines: string[] = [
    '## Contribution Submission',
    '',
    '```json',
    JSON.stringify(payload.entry, null, 2),
    '```',
    '',
    '### Metadata',
    '',
    `- Submitted at: ${submittedAt}`,
    '- Source: Website Contribution Form',
  ];
  if (payload.submitterNotes) {
    lines.push(`- Reviewer notes: ${payload.submitterNotes}`);
  }
  return lines.join('\n');
}

async function createGitHubIssue(
  payload: z.infer<typeof ContributionPayloadSchema>
): Promise<{ issueUrl: string; issueNumber: number }> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error('GitHub environment variables are not configured');
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'BLW-Contribution/1.0',
    },
    body: JSON.stringify({
      title: `New Dataset Contribution: ${payload.entry.name}`,
      body: buildIssueBody(payload, new Date().toISOString()),
      labels: ['contribution', 'dataset'],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown');
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  const issue = (await response.json()) as { html_url: string; number: number };
  return { issueUrl: issue.html_url, issueNumber: issue.number };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const result = ContributionPayloadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { message: 'Validation failed', errors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const { issueUrl, issueNumber } = await createGitHubIssue(result.data);
    return NextResponse.json({ issueUrl, issueNumber }, { status: 200 });
  } catch (err) {
    console.error('GitHub API error:', err);
    return NextResponse.json(
      { message: 'Failed to create submission. Please try again.' },
      { status: 502 }
    );
  }
}
