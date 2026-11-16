# BLW Plus plan

Status: **demand test running** (started Nov 2026). Nothing of Plus is built yet, apart from the interest list.

## Why

A parent who used the free app wanted to tick foods and write notes directly on screen. Today the checklist is a
file to download and print, so she could not. Plus would let parents do that digitally and share it with their partner.

Before building any of it, the app has a "Join the Plus list" form that measures interest.
See `docs/plus-interest-sheet.md` for how sign-ups are saved.

## Decisions already made

| Topic | Decision |
|---|---|
| Sharing | One household with **2 adults**, and **2 devices in total** (not 2 per adult). |
| Pricing model | **Monthly**, and a **6-month pass** (one payment). No prices set yet. |
| Free version | Stays exactly as it is: no account, nothing stored, download or print the checklist. |
| MilkDrop | A different app. No shared login and no bundle, because not every parent wants it. |
| Interest test first | Yes. Build nothing until the list shows real interest. |

## What Plus would include (first version)

- An account (email and password).
- The 30-day plan saved in the account, with each day tickable: offered, reaction, notes.
- Free notes per day.
- Sharing with one partner, on up to 2 devices in total.
- Download or print the checklist at any time, as in the free version.

Not in the first version: reminders, photos, more than one baby, MilkDrop data, sharing with more people.

## How sharing works

- A **household** owns the baby, the plan, the notes and the subscription. One subscription covers both parents.
- A household has at most **2 adults**. Each one has their own email and password. Nobody shares a password.
- The first adult creates the household and invites the second by email (a link that expires in 7 days).
- A household can have at most **2 signed-in devices** at the same time. If a third one signs in, the app asks
  which device to sign out. There is a "your devices" list with a sign-out button for each one.
- Every change records who made it and when (for example "Dad updated this"). If two people edit the same day,
  the last change wins and the other person sees it.

## Tools (suggested, not final)

- **Database and login:** Postgres in an EU region. Supabase is the suggestion, because it gives login, password
  hashing, email checks, password reset and row-level security. The alternative is Neon plus Better Auth: cheaper,
  but more security work to write and keep.
- **Payments:** Stripe subscriptions, with Stripe's own page for changing or cancelling the plan.
- **Email:** Resend.
- **Hosting:** Vercel, as now.
- Check current prices before choosing. A paid database plan is likely needed for backups.

## Tables

| Table | What it holds |
|---|---|
| `households` | plan (free or Plus), Stripe ids, when the subscription ends |
| `household_members` | which adults belong to a household (max 2, one household each), role owner or partner |
| `invites` | invite link (stored only as a hash), expires in 7 days |
| `babies` | name or nickname, start date, diet, allergies, feeding type, milestones |
| `plan_days` | one row per day: date, food id, category, offered, offered time, reaction, notes, who changed it, when |
| `notes` | free notes per baby and date, with the author |
| `devices` | each signed-in device, last seen, revoked or not (limit: 2 active per household) |
| `consents` | which terms and privacy version each person accepted, and when |
| `billing_events` | Stripe event ids, so a repeated message is never applied twice |
| `audit_log` | sign-ins, invites, removals, exports, deletions |

Passwords and sessions stay in the login system's own tables.

The data fits what the app already has. The `ChecklistItem` type already has `isOffered`, `hasAllergyReaction` and `notes`.

## Security checklist

- Passwords are hashed by the login system. Never stored as text. Email check and a reset link.
- **Every table has a household id, and the database refuses to show rows from another household** (row-level security).
  A bug in the app code must not be able to leak another family's data.
- The server never trusts a household id sent by the browser.
- Cookies are secure and not readable by scripts.
- A real rate limit on login, sign-up and invites. The current in-memory limiter does not work across Vercel instances.
- Check Stripe's signature on every webhook. Keep all secrets in Vercel settings.
- Escape all text before showing it. Notes are free text. (The same rule caught a real bug in the skill servers.)
- Collect little: a nickname is enough, no birth date. Account deletion removes everything. Data export on request.
- Backups, and a test of restoring one.
- Tests that prove parent A cannot read household B.

## Privacy and legal

This is data about a baby's health and allergies. If you or your users are in the EU, plan for:

- an updated privacy policy and terms,
- consent at sign-up,
- EU data location,
- agreements with each provider (Supabase, Stripe, Resend, Vercel),
- data export and deletion,
- a clear medical disclaimer.

Have the policy and terms reviewed once by someone qualified. The current privacy note promises "nothing is stored"
for free users. That must stay true for them, and Plus needs its own honest wording.

## Build order

1. **Demand test (running).** Count sign-ups, plan choices, and what people want to track.
2. **Go or no-go.** Decide with the numbers (see below). If no, stop here. The free app stays as it is.
3. **Accounts and database,** with login, email check, and the household isolation tests.
4. **The digital tracker:** save the profile and plan, tick foods, mark reactions, write notes.
   A "Save this plan to my account" button imports the plan a parent already made.
5. **Sharing:** invites, the device list and limit, who changed what.
6. **Payments:** Stripe, the Plus gate, cancelling, failed renewals.
7. **Launch:** legal text, export and deletion, a security review, then a small beta before everyone.

## Reading the demand test

The sheet has one row per person: email, plan choice, language, what they would track.

- Compare the number of rows with the number of plans generated in the same period.
- Compare "Monthly" with "6-month pass". Solids start around 6 months of age, so the pass may fit better.
- Read the "would like to track" answers. They show what Plus must do first.
- Decide the bar for "worth it" **before** looking at the numbers, and write it here:

  `Go if: ______ sign-ups in ______ weeks.`

Planned review date: around Dec 7, together with the paid-section decision.

## Open questions

- Prices for the monthly plan and the 6-month pass.
- Supabase or Neon with Better Auth.
- What a household gets after it stops paying: read-only access for some weeks, or export and delete only.
- Should a household be able to keep more than one baby (twins)?
- Does the free "Save this plan" import need an account, or can it stay local first?
