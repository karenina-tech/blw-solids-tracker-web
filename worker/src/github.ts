import type { Env } from './types';
import type { ValidatedPayload } from './validation';

function buildIssueBody(payload: ValidatedPayload, submittedAt: string): string {
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

export async function createGitHubIssue(
  payload: ValidatedPayload,
  env: Env
): Promise<{ issueUrl: string; issueNumber: number }> {
  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'BLW-Contribution-Worker/1.0',
      },
      body: JSON.stringify({
        title: `New Dataset Contribution: ${payload.entry.name}`,
        body: buildIssueBody(payload, new Date().toISOString()),
        labels: ['contribution', 'dataset'],
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown');
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  const issue = (await response.json()) as { html_url: string; number: number };
  return { issueUrl: issue.html_url, issueNumber: issue.number };
}
