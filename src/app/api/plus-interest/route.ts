import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRateLimiter } from '@/lib/rateLimit';
import { PLUS_PLAN_LABELS, PlusInterestSchema } from '@/types/plusInterest';

// Fake-door test: we only want to know whether parents would use a paid Plus plan.
// There is no database. Each sign-up arrives as one plain-text email to the owner.
// Needed in Vercel: RESEND_API_KEY and PLUS_INTEREST_TO. Optional: PLUS_INTEREST_FROM.

const checkRateLimit = createRateLimiter(15 * 60 * 1000, 5);

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? request.headers.get('x-real-ip') ?? 'unknown';

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, kind: 'rateLimit' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, kind: 'validation' }, { status: 400 });
  }

  // Bots fill the hidden field. Answer "ok" so they stop trying, and send nothing.
  const raw = body as Record<string, unknown> | null;
  if (typeof raw?.website === 'string' && raw.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = PlusInterestSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ ok: false, kind: 'validation', errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PLUS_INTEREST_TO;
  if (!apiKey || !to) {
    console.error('[plus-interest] RESEND_API_KEY or PLUS_INTEREST_TO is not set');
    return NextResponse.json({ ok: false, kind: 'server' }, { status: 503 });
  }

  const { email, plan, wish, locale } = parsed.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.PLUS_INTEREST_FROM ?? 'BLW Solids Tracker <contact@kareninatech.com>',
    to,
    replyTo: email,
    // Only a fixed label goes in the subject, never visitor text.
    subject: `BLW Plus interest: ${PLUS_PLAN_LABELS[plan]}`,
    text: [
      `Email:    ${email}`,
      `Prefers:  ${PLUS_PLAN_LABELS[plan]}`,
      `Language: ${locale}`,
      `When:     ${new Date().toISOString()}`,
      '',
      'Would like to track:',
      wish ? wish : '(not answered)',
    ].join('\n'),
  });

  if (error) {
    console.error('[plus-interest] Resend error:', error);
    return NextResponse.json({ ok: false, kind: 'server' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
