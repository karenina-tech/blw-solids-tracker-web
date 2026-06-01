# 🥑 BLW Solids Tracker

## Motivation

Starting complementary feeding can be overwhelming for first-time parents, especially when implementing the Baby-Led Weaning (BLW) method.

This tool helps parents track the introduction of solid foods in a safe, suggested order. It places special emphasis on tracking **potentially allergenic foods**. By using this tool, parents gain peace of mind and clear visibility into which foods have been offered, which were rejected, and which caused allergic reactions.

👉 **[Try it live](https://blw.kareninatech.com/)**

<details>
  <summary>📸 Click to view the printable checklist design</summary>
  <br>
  <p><strong>Header & Intro:</strong></p>
  <img src="./assets/preview-header.png" alt="Header" width="500px">
  <br><br>
  <p><strong>30-Day Tracking Table and Footer:</strong></p>
  <img src="./assets/preview-footer.png" alt="Table Rows" width="500px">
</details>

---

## Features

- **Readiness check** — evaluates age and developmental milestones against WHO and AAP guidelines before generating a plan
- **Personalised food list** — filters by age, diet type (standard / vegetarian / vegan), and known allergens
- **30-day plan** — generates a safe, sequenced introduction schedule starting from your chosen date
- **Printable checklist** — download an A4 HTML file with food items, preparation notes, allergen badges, and an allergy quick reference card
- **Contribute a food** — submit missing foods via form; each submission is reviewed before it goes live

---

## Local development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run types` | Type check only |
| `npm run verify` | Full check: audit + types + tests + build |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Validation | Zod |
| Tests | Jest + Testing Library |
| Deployment | GitHub Pages |
| Contribution backend | Cloudflare Worker |

---

## Contributing a food

The app has a built-in **"Contribute a food"** tab. Fill in the food details and submit it creates a GitHub Issue for review. No account needed.

If you want to contribute directly via code, open a pull request with changes to [`src/data/foodDataset.ts`](src/data/foodDataset.ts).

---

## Deployment

The app is deployed automatically to GitHub Pages on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

The contribution form backend is a separate Cloudflare Worker. See [`worker/README.md`](worker/README.md) for setup instructions.

---

## ⚠️ Safety notice

- This tool does **not** replace professional medical advice.
- Always consult your pediatrician before starting solids.
- Never leave your baby unattended while eating.
- Prepare all foods in an **age-appropriate size and texture** to prevent choking.
