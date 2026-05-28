import { ContributionPayloadSchema } from './validation';
import { checkRateLimit } from './rateLimit';
import { createGitHubIssue } from './github';
import type { Env } from './types';

function corsHeaders(origin: string, allowedOrigin: string): Record<string, string> {
  const allowed = allowedOrigin === '*' || origin === allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN ?? '*');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/submit') {
      return json({ message: 'Not found' }, 404, cors);
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { allowed, retryAfterSeconds } = checkRateLimit(ip);
    if (!allowed) {
      return json(
        { message: 'Too many requests. Please try again later.' },
        429,
        { ...cors, 'Retry-After': String(retryAfterSeconds) }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ message: 'Invalid JSON body' }, 400, cors);
    }

    const result = ContributionPayloadSchema.safeParse(body);
    if (!result.success) {
      return json(
        { message: 'Validation failed', errors: result.error.flatten().fieldErrors },
        422,
        cors
      );
    }

    try {
      const { issueUrl, issueNumber } = await createGitHubIssue(result.data, env);
      return json({ issueUrl, issueNumber }, 200, cors);
    } catch (err) {
      console.error('GitHub API error:', err);
      return json({ message: 'Failed to create submission. Please try again.' }, 502, cors);
    }
  },
};
