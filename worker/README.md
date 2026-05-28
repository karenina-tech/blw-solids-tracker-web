# BLW Contribution Worker

This is a small Cloudflare Worker that receives food contributions from the website form, checks them, and creates a GitHub Issue for review.

No entry is added to the dataset automatically, I personally review each issue first.

## How it works

```
User fills form → Worker checks input → GitHub Issue is created → Maintainer reviews
```

## What you need before starting

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is enough)
- [Node.js](https://nodejs.org) version 18 or newer
- Wrangler (the Cloudflare CLI) installed globally:
  ```bash
  npm install -g wrangler
  ```
- A GitHub personal access token with **Issues: Read & Write** permission on this repo.
  Create one at: GitHub → Settings → Developer settings → Fine-grained tokens

## Step-by-step setup

### 1. Install packages

```bash
cd worker
npm install
```

### 2. Set your GitHub token (keep this secret)

```bash
wrangler secret put GITHUB_TOKEN
```

Paste your token when prompted. It is stored encrypted in Cloudflare and never exposed.

### 3. Edit `wrangler.toml`

Open `worker/wrangler.toml` and fill in your values:

```toml
[vars]
GITHUB_OWNER   = "your-github-username"
GITHUB_REPO    = "blw-solids-tracker-web"
ALLOWED_ORIGIN = "https://your-username.github.io"
```

### 4. Connect the frontend

Create a `.env.local` file in the project root:

```
VITE_WORKER_URL=https://blw-contribution-worker.<your-subdomain>.workers.dev/submit
```

During local development the default `http://localhost:8787/submit` is used automatically.

## Running locally

```bash
# Terminal 1 — start the worker
cd worker
npm run dev

# Terminal 2 — start the website
npm run dev
```

## Deploying

```bash
cd worker
npm run deploy
```

Wrangler will show the live URL. Copy it into your `.env.local` (and your GitHub Pages deploy settings if you use environment variables there).

## What a submitted GitHub Issue looks like

```
Title: New Dataset Contribution: Mango

## Contribution Submission

{
  "id": "mango",
  "name": "Mango",
  "category": "Standard",
  ...
}

### Metadata
- Submitted at: 2026-05-28T09:00:00.000Z
- Source: Website Contribution Form
```

## Security notes

- The GitHub token is never sent to the browser — it lives only in Cloudflare.
- Each IP address can submit at most 5 times every 15 minutes.
- All form fields are validated on the server before the issue is created.
- Only requests from `ALLOWED_ORIGIN` are accepted.
- The `TURNSTILE_SECRET` variable is reserved for adding a CAPTCHA later if needed.
