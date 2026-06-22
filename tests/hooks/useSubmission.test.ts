import { renderHook, act } from '@testing-library/react';
import { useSubmission } from '@/hooks/useSubmission';

const URL = 'https://example.com/submit';

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  global.fetch = jest.fn().mockResolvedValue(response);
}

afterEach(() => jest.resetAllMocks());

describe('useSubmission — initial state', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useSubmission(URL));
    expect(result.current.submission.status).toBe('idle');
  });

  it('reset returns to idle after an error', async () => {
    mockFetch({ ok: false, status: 500 });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    act(() => result.current.reset());
    expect(result.current.submission.status).toBe('idle');
  });
});

describe('useSubmission — success', () => {
  it('sets success with issueUrl on 200', async () => {
    mockFetch({ ok: true, json: async () => ({ issueUrl: 'https://github.com/issues/1' }) });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toEqual({ status: 'success', issueUrl: 'https://github.com/issues/1' });
  });
});

describe('useSubmission — validation errors', () => {
  it('sets validation error on 400 using the server message', async () => {
    mockFetch({ ok: false, status: 400, json: async () => ({ message: 'Bad input' }) });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'validation', message: 'Bad input' });
  });

  it('sets validation error on 422 using the server message', async () => {
    mockFetch({ ok: false, status: 422, json: async () => ({ message: 'Validation failed' }) });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'validation', message: 'Validation failed' });
  });

  it('falls back to generic validation message on 422 with no body message', async () => {
    mockFetch({ ok: false, status: 422, json: async () => ({}) });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'validation' });
    expect((result.current.submission as { message: string }).message).toBeTruthy();
  });
});

describe('useSubmission — server errors', () => {
  it.each([500, 502, 503])('sets server error on %d', async (status) => {
    mockFetch({ ok: false, status });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'server' });
  });
});

describe('useSubmission — rate limit', () => {
  it('sets rateLimit error on 429', async () => {
    mockFetch({ ok: false, status: 429 });
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'rateLimit' });
  });
});

describe('useSubmission — network error', () => {
  it('sets network error when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const { result } = renderHook(() => useSubmission(URL));
    await act(async () => { await result.current.submit({}); });
    expect(result.current.submission).toMatchObject({ status: 'error', kind: 'network' });
  });
});
