import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResultNotice } from '@/components/PlusInterest';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

function json(status: number, body: unknown) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: async () => body });
}

// Small helpers on top of fireEvent, so the tests read like what a person does.
const user = {
  click: async (el: HTMLElement) => { fireEvent.click(el); },
  type: async (el: HTMLElement, text: string) => { fireEvent.change(el, { target: { value: text } }); },
  keyboard: async (_keys: string) => { fireEvent.keyDown(document, { key: 'Escape' }); },
};

async function openDialog() {
  render(<ResultNotice />);
  await user.click(screen.getByRole('button', { name: 'Join the Plus list' }));
  return user;
}

describe('result notice', () => {
  it('says plainly that the list cannot be edited on screen', () => {
    render(<ResultNotice />);
    expect(screen.getByText('This checklist cannot be edited on screen.')).toBeInTheDocument();
    expect(screen.getByText(/print it/i)).toBeInTheDocument();
  });

  it('does not show the form until asked', () => {
    render(<ResultNotice />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Plus list form', () => {
  it('opens as a dialog and closes with Escape', async () => {
    const u = await openDialog();
    expect(screen.getByRole('dialog', { name: 'BLW Plus: not built yet' })).toBeInTheDocument();
    await u.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows an error under each field that is missing and sends nothing', async () => {
    const u = await openDialog();
    await u.click(screen.getByRole('button', { name: 'Join the list' }));
    expect(await screen.findByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByText('Choose one option.')).toBeInTheDocument();
    expect(screen.getByText('Please tick the box to join the list.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses an email that does not look valid', async () => {
    const u = await openDialog();
    await u.type(screen.getByLabelText('Your email'), 'mom@');
    await u.click(screen.getByRole('radio', { name: 'Monthly' }));
    await u.click(screen.getByRole('checkbox'));
    await u.click(screen.getByRole('button', { name: 'Join the list' }));
    expect(await screen.findByText('That email address does not look valid.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the answers and shows a thank you', async () => {
    fetchMock.mockReturnValue(json(200, { ok: true }));
    const u = await openDialog();
    await u.type(screen.getByLabelText('Your email'), 'mom@example.com');
    await u.click(screen.getByRole('radio', { name: '6-month pass (one payment)' }));
    await u.type(screen.getByLabelText('What would you want to track? (optional)'), 'reactions');
    await u.click(screen.getByRole('checkbox'));
    await u.click(screen.getByRole('button', { name: 'Join the list' }));

    expect(await screen.findByText(/You are on the list/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/plus-interest');
    expect(JSON.parse(init.body)).toMatchObject({
      email: 'mom@example.com',
      plan: 'six_month',
      wish: 'reactions',
      consent: true,
      website: '',
    });
  });

  it('shows a clear message and keeps the answers when the server fails', async () => {
    fetchMock.mockReturnValue(json(503, { ok: false, kind: 'server' }));
    const u = await openDialog();
    await u.type(screen.getByLabelText('Your email'), 'mom@example.com');
    await u.click(screen.getByRole('radio', { name: 'Not sure yet' }));
    await u.click(screen.getByRole('checkbox'));
    await u.click(screen.getByRole('button', { name: 'Join the list' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByLabelText('Your email')).toHaveValue('mom@example.com');
  });

  it('tells the parent when there were too many tries', async () => {
    fetchMock.mockReturnValue(json(429, { ok: false, kind: 'rateLimit' }));
    const u = await openDialog();
    await u.type(screen.getByLabelText('Your email'), 'mom@example.com');
    await u.click(screen.getByRole('radio', { name: 'Monthly' }));
    await u.click(screen.getByRole('checkbox'));
    await u.click(screen.getByRole('button', { name: 'Join the list' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too many tries');
  });
});
