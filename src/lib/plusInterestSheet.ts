import { PLUS_PLAN_LABELS, type PlusPlan } from '@/types/plusInterest';

// Sends one sign-up to a Google Sheet through a small Apps Script web app (see docs/plus-interest-sheet.md).

export interface SheetRow {
  email: string;
  plan: PlusPlan;
  wish?: string;
  locale: string;
}

/**
 * A spreadsheet treats text that starts with = + - or @ as a formula. A visitor could type
 * =HYPERLINK(...) in the "what would you track" box, so those cells get a leading apostrophe.
 */
export function toSheetCell(value: string | undefined): string {
  const text = (value ?? '').replace(/\r\n?/g, '\n');
  return /^[=+\-@\t]/.test(text) ? `'${text}` : text;
}

export function isSheetConfigured(): boolean {
  return Boolean(process.env.PLUS_INTEREST_SHEET_URL && process.env.PLUS_INTEREST_SHEET_SECRET);
}

export async function saveToSheet(row: SheetRow): Promise<void> {
  const url = process.env.PLUS_INTEREST_SHEET_URL;
  const secret = process.env.PLUS_INTEREST_SHEET_SECRET;
  if (!url || !secret) throw new Error('Sheet settings are not set');

  const res = await fetch(url, {
    method: 'POST',
    // Apps Script web apps accept plain text bodies without a preflight request.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      secret,
      when: new Date().toISOString(),
      email: toSheetCell(row.email),
      plan: PLUS_PLAN_LABELS[row.plan],
      locale: row.locale,
      wish: toSheetCell(row.wish),
    }),
    redirect: 'follow',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) throw new Error(`Sheet answered ${res.status}`);
  const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!json?.ok) throw new Error(`Sheet refused the row: ${json?.error ?? 'no answer'}`);
}
