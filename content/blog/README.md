# Blog articles

Each article is one Markdown file in this folder. The file name is the URL:
`content/blog/is-my-baby-ready-for-solids.md` becomes `/blog/is-my-baby-ready-for-solids`.

File names must be lowercase words separated by dashes (`a-z`, `0-9`, `-`). Anything else
(including this README) is ignored.

## Template

```md
---
title: "Is my baby ready for solids? The 4 readiness signs"
description: "One or two sentences for Google results. Between 70 and 165 characters."
date: "2026-11-20"
updated: "2026-12-05" # optional, only when the content changes
draft: true # true = hidden everywhere, false = published
tags: ["readiness", "starting solids"]
sources:
  - label: "Organisation: exact page title"
    url: "https://link-to-the-exact-page-you-read"
---

Write the article here in Markdown. Use `##` for sections and `###` for sub-sections.
The page title already comes from `title`, so do not add a `#` heading.
```

## Rules the build enforces

- `title`: 10 to 90 characters. `description`: 70 to 165 characters.
- `date` format `YYYY-MM-DD`.
- At least one entry in `sources` (health content must cite CDC, WHO, AAP or similar).
- A broken article fails `npm run build`, so it can never reach production half-finished.

## Publishing every ~20 days

1. Write the article with `draft: true` on a branch (for example `content/<slug>`).
2. Open every source link in a browser and confirm it loads and says what the article claims. Then review the preview deploy on Vercel.
3. On the publish day, set `draft: false` and the final `date`, then merge to `staging` and open the PR to `main`.
4. After the deploy, open the new URL in Google Search Console, run **Inspección de URLs**, and click **Solicitar indexación**.
