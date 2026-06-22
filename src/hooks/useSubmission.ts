import { useState } from 'react';
import type { ErrorKind, SubmissionState } from '@/types/contribution';

const MESSAGES: Record<ErrorKind, string> = {
  rateLimit:
    "Wow! We're receiving a lot of contributions right now. Please wait a few minutes before trying again.",
  server:
    "We're having trouble connecting to our server. Your contribution is important to us — please try again later.",
  validation:
    "Something looks off with the submitted data. Please review the form and try again.",
  network:
    "Please check your internet connection and try again.",
  unknown:
    "Something unexpected went wrong. Please try again.",
};

function errorState(kind: ErrorKind, override?: string): Extract<SubmissionState, { status: 'error' }> {
  return { status: 'error', kind, message: override ?? MESSAGES[kind] };
}

export function useSubmission(url: string) {
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' });

  function reset() {
    setSubmission({ status: 'idle' });
  }

  async function submit(payload: unknown): Promise<void> {
    setSubmission({ status: 'loading' });

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      setSubmission(errorState('network'));
      return;
    }

    if (res.ok) {
      const data = (await res.json()) as { issueUrl: string };
      setSubmission({ status: 'success', issueUrl: data.issueUrl });
      return;
    }

    switch (res.status) {
      case 429:
        setSubmission(errorState('rateLimit'));
        break;

      case 400:
      case 422: {
        const body = await res.json().catch(() => ({} as { message?: string })) as { message?: string };
        setSubmission(errorState('validation', body.message));
        break;
      }

      case 500:
      case 502:
      case 503:
        setSubmission(errorState('server'));
        break;

      default:
        setSubmission(errorState('unknown'));
    }
  }

  return { submission, submit, reset };
}
