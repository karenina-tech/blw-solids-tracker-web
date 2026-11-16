/** @jest-environment node */
import { NextRequest } from 'next/server';

const sendMock = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

import { POST } from '@/app/api/plus-interest/route';

let ipCounter = 0;
function call(body: unknown, ip = `10.0.0.${++ipCounter}`) {
  return POST(
    new NextRequest('http://localhost/api/plus-interest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  );
}

const valid = { email: 'mom@example.com', plan: 'six_month', wish: 'reactions', consent: true, locale: 'en', website: '' };

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  sendMock.mockReset();
  sendMock.mockResolvedValue({ error: null });
  process.env.RESEND_API_KEY = 're_test';
  process.env.PLUS_INTEREST_TO = 'owner@example.com';
});

afterEach(() => jest.restoreAllMocks());

afterAll(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.PLUS_INTEREST_TO;
});

describe('POST /api/plus-interest', () => {
  it('sends one email to the owner and answers ok', async () => {
    const res = await call(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const mail = sendMock.mock.calls[0][0];
    expect(mail.to).toBe('owner@example.com');
    expect(mail.replyTo).toBe('mom@example.com');
    expect(mail.subject).toBe('BLW Plus interest: 6-month pass');
    expect(mail.text).toContain('mom@example.com');
    expect(mail.text).toContain('reactions');
  });

  it('never puts visitor text in the subject', async () => {
    await call({ ...valid, wish: 'Subject: injected\nBcc: x@y.z' });
    expect(sendMock.mock.calls[0][0].subject).toBe('BLW Plus interest: 6-month pass');
  });

  it('works without the optional wish', async () => {
    const res = await call({ ...valid, wish: undefined });
    expect(res.status).toBe(200);
    expect(sendMock.mock.calls[0][0].text).toContain('(not answered)');
  });

  it('gives one error code per field', async () => {
    const res = await call({ email: '', plan: 'free', consent: false });
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.errors).toEqual({ email: 'emailRequired', plan: 'planRequired', consent: 'consentRequired' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('refuses an email that is not valid', async () => {
    const res = await call({ ...valid, email: 'mom@' });
    expect(res.status).toBe(422);
    expect((await res.json()).errors.email).toBe('emailInvalid');
  });

  it('refuses a wish that is too long', async () => {
    const res = await call({ ...valid, wish: 'x'.repeat(501) });
    expect(res.status).toBe(422);
    expect((await res.json()).errors.wish).toBe('wishTooLong');
  });

  it('refuses consent that is not exactly true', async () => {
    const res = await call({ ...valid, consent: 'yes' });
    expect(res.status).toBe(422);
  });

  it('answers ok to bots that fill the hidden field, and sends nothing', async () => {
    const res = await call({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('refuses a body that is not JSON', async () => {
    const res = await call('not json');
    expect(res.status).toBe(400);
  });

  it('slows down one visitor after 5 tries', async () => {
    const ip = '203.0.113.9';
    for (let i = 0; i < 5; i++) expect((await call(valid, ip)).status).toBe(200);
    const res = await call(valid, ip);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeTruthy();
    expect((await call(valid, '203.0.113.10')).status).toBe(200);
  });

  it('answers 503 when the email settings are missing', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await call(valid);
    expect(res.status).toBe(503);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('answers 500 when the email service fails', async () => {
    sendMock.mockResolvedValue({ error: { message: 'boom' } });
    const res = await call(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).kind).toBe('server');
  });
});
