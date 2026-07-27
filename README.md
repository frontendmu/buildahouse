# buildahouse

**buildahouse.mu** — a checklist and guide for anyone building a house in Mauritius, so nothing important gets missed.

[Markdown Scratchpad here](https://www.notion.so/Build-a-House-1689b5028e0a80f0a16ed215c15ceed0)

## Running it

```sh
pnpm install
pnpm dev        # http://localhost:3000
pnpm generate   # static site into .output/public
```

If content edits don't show up, the parsed-content cache is stale: `rm -rf .nuxt .data .output`.

## Deploying

Static output, so any host works. On Cloudflare: build command `pnpm generate`, output directory `.output/public`.

The build compiles `better-sqlite3` from source, which pnpm only does for packages listed in `pnpm-workspace.yaml`. Cloudflare's build image is a few pnpm versions behind, so that file names the packages twice — see the comments there before tidying it up.

## Guides, in build order

| Phase | Guide | Covers |
| --- | --- | --- |
| 1 | [land](content/land.md) | Zoning, notary, title search, survey, excision, soil test |
| 2 | [finance](content/finance.md) | Budget, loan pre-approval, comparing lenders, tranches, insurance |
| 2 | [mra](content/mra.md) | Government schemes, refunds, and grants |
| 2 | [finance-tools](content/finance-tools.md) | Open-source tools for tracking spend against disbursements |
| 3 | [architect](content/architect.md) | Choosing an architect, fees, the design process |
| 3 | [quantity-surveyor](content/quantity-surveyor.md) | Cost estimation, Bill of Quantities, where budgets break |
| 4 | [permit](content/permit.md) | Building and Land Use Permit (BLP) |
| 4 | [contractor](content/contractor.md) | Selection, quotations, contract, payment milestones, retention |
| 5 | [construction-phases](content/construction-phases.md) | Stage-by-stage site checks, from setting out to snagging |
| 5 | [construction-starter-guide](content/construction-starter-guide.md) | The whole build on one page, in site vocabulary |
| 5 | [glossary](content/glossary.md) | Kreol and French building terms |
| 6 | [ceb](content/ceb.md) | Electricity connection |
| 6 | [cwa](content/cwa.md) | Water connection |
| 6 | [wma](content/wma.md) | Wastewater — sewer or septic tank |
| 6 | [telecom](content/telecom.md) | Internet and telephone |
| 7 | [occupation-certificate](content/occupation-certificate.md) | Occupation Certificate, municipal records, claiming refunds |

## Content conventions

Guides live in `content/`, one file per topic, lowercase filename = URL path. Adding a file is all it takes to add a page — the homepage, the phase grouping, and the prev/next navigation are all derived from frontmatter.

- **Frontmatter** — every guide carries `title`, `description`, `phase`, `order`, `tags`, and `lastVerified`. The schema in `content.config.ts` enforces this, so a missing field fails the build.
- **`description`** — the one-line summary on the homepage card. Quote it if it contains a colon, or YAML reads it as a nested map.
- **`order`** — sorts guides within and across phases; it drives prev/next. Numbered by phase (10s for phase 1, 20s for phase 2, …) to leave room for insertions.
- **`lastVerified`** — the date the facts and links in the file were last checked against official sources. Shown on every page so readers know how fresh the information is. **Update it whenever you change a figure.**
- **`[VERIFY]`** — marks a figure, fee, or document list that must be confirmed against an official source before publication. **Never replace one with a guess.**
- **`[[wiki-links]]`** — cross-references between guides, written as the target's filename without the extension. `modules/wiki-links.ts` resolves them to real titles and paths at parse time, which keeps the markdown readable on GitHub.
- **Checklists** — every guide ends with a `- [ ]` checklist. These become the tickable items on the site. Progress is keyed by the item's **text**, not its position, so reordering a list keeps readers' ticks — but rewording an item resets that one.
- **`# Title` heading** — keep it, even though it duplicates the frontmatter title. It's hidden on the site (`sr-only`) and matters when the file is read as plain markdown.

## Accuracy policy

Government schemes, fees, and document requirements in Mauritius change with each annual Budget and with departmental practice. Wrong figures here cost readers real money.

- Cite the official source for every claim.
- Re-verify scheme amounts, ceilings, and end dates before each release, and update `lastVerified`.
- Prefer omitting a number to publishing a stale one.

### Verification status

Sources were checked against official websites on **2026-07-27**. `mra.md`, `permit.md`, `cwa.md`, `ceb.md`, and `occupation-certificate.md` carry verified figures; the rest are guidance rather than published fact.

**Confirmed and corrected in that pass:**
- Housing Loan Relief Scheme extended to **June 2027**, but tapered to **Rs 667/month** then **Rs 333/month** — not the Rs 1,000 widely quoted. Applications close 31 Dec 2027.
- **VAT refund is closed to new construction** — qualifying window ended 30 June 2025. Its 1,800 ft² floor-area limit no longer constrains new designs.
- CWA charges **Rs 2,200 installation on top of** the Rs 500 processing fee.
- Occupation Certificate is a **two-step** process: compliance certificate first, then apply for the occupation certificate **within 5 days**.
- BLP is valid for **2 years**; drawings above **150 m²** need a registered Professional Architect.

**Still unverified — do not treat as fact:**
- **CIDB** — all CIDB domains failed DNS. Whether registration is mandatory for residential work, the grades, and whether a public register exists are all unconfirmed.
- **WMA** — no reachable website found. The document list in `WMA.md` is inferred from CWA/CEB practice, not from a WMA source.
- **Rs/ft² construction rates** — no authoritative published source exists; deliberately omitted.
- Registration duty exemption ceiling; Home Ownership Refund and Home Loan Payment schemes (both likely expired — source URLs now dead).
- CEB connection charges, compliance/occupation certificate fees, municipal rates, telecom install charges, soil test cost.

These need phone calls rather than fetches — the figures either aren't published or the publishing sites are unreachable.

## Stack

Nuxt 4 + `@nuxt/content` v3, statically generated (`pnpm generate`, prerendered by crawling links from `/`). Tailwind CSS with `@tailwindcss/typography`. Checklist progress saved in the browser via `localStorage` under `buildahouse:progress` — no accounts, no backend, nothing leaves the device. English at launch, content structured so French and Kreol Morisien can be added later.

```
content/                 the guides — the actual substance of the site
content.config.ts        collection schema (fails the build on bad frontmatter)
modules/wiki-links.ts    resolves [[slug]] to real titles at parse time
app/pages/index.vue      homepage, guides grouped by phase
app/pages/[...slug].vue  a guide page
app/components/content/ProseLi.vue   makes `- [ ]` items tickable
app/composables/useChecklist.ts      localStorage progress
```

Two things worth knowing before editing the app:

- **`~` resolves to `app/`**, not the project root — hence the relative `./modules/wiki-links` in `nuxt.config.ts`.
- **Content v3's body is a "minimal" AST**: an element node is an array `[tag, props, ...children]`, not an object with `.tag`. Anything walking the tree must handle that shape.
