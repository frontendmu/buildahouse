---
title: Tools for Tracking the Money
description: Free, open-source tools for keeping track of what you have spent and what the bank has released.
phase: 2
order: 22
tags: finance, tools, budget
lastVerified: 2026-07-27
---

# Open-Source Financial Tools for Home Construction

A house is the largest project most people ever manage, and it is usually tracked on the back of an envelope. Any of these beats that. Pick one and stick with it — see [[finance]] for what to track, and [[quantity-surveyor]] for getting the estimate right in the first place.

## 1. Project Management & Progress Tracking

_Best for: Managing construction phases (Site prep -> Foundation -> Grey -> Finishes) alongside costs._

- **[GanttProject](https://www.ganttproject.biz/):** A desktop tool for creating timelines. Good for mapping out the build month by month. You can assign costs to specific tasks (e.g. "Slab Casting") to see your burn rate.

## 2. Strict Accounting & Ledger Management

_Best for: Accurate bookkeeping, managing bank loans (MHC/Commercial Banks), and VAT tracking._

- **[Ledger-cli](https://ledger-cli.org/):** A powerful, double-entry accounting tool for those who prefer the command line. It uses a simple text-based format, making it incredibly easy to version control your house finances via Git.
- **[GnuCash](https://www.gnucash.org/):** The standard for open-source accounting. Perfect for tracking "Capital Expenses." You can set up an account hierarchy specifically for your construction (e.g., `Assets:Fixed Assets:House Materials`).

## 3. Spreadsheet-Based Solutions

_Best for: Quick calculations and customized Mauritian cost-per-square-foot estimates._

- **[LibreOffice Calc](https://www.libreoffice.org/):** The best offline, open-source alternative to Excel.

---

## Tool Comparison Matrix

| Tool             | Focus       | Format                    | Skill Level         |
| ---------------- | ----------- | ------------------------- | ------------------- |
| **Ledger-cli**   | Precision   | Command Line / Plain Text | High (Dev-friendly) |
| **GnuCash**      | Accounting  | Desktop UI                | Moderate            |
| **GanttProject** | Timeline    | Desktop UI                | Easy                |
| **LibreOffice**  | Flexibility | Spreadsheet               | Easy                |

---

### Mauritian Context: Financial Milestones

Set up one account or category per **disbursement stage**, so you can see at a glance whether the money released matches the work standing on site. Lenders release a housing loan in tranches against certified progress, roughly in this order:

1. **Stage 1:** Foundations & plinth
2. **Stage 2:** Columns & roof slab
3. **Stage 3:** Openings & plastering
4. **Stage 4:** Tiling, painting, electrical & plumbing
5. **Stage 5:** Retention held back after completion

⚠️ **[VERIFY]** — the **percentage** released at each stage and the **retention** amount and period are set by your lender and your building contract, and they differ between banks. Take them from your own loan offer letter, not from any list online. See [[finance]] for the tranche mechanics and [[contractor]] on retention.

### A checklist for setting this up

- [ ] Choose one tool and use it from the first payment, not from the middle of the build.
- [ ] Create a category per disbursement stage, using the percentages in **your** loan offer letter.
- [ ] Record every cash payment to workers and suppliers — these are the ones that vanish from the record.
- [ ] Keep receipts for anything you might claim later — see [[mra]].
- [ ] Reconcile what the bank has released against what is actually built, at every stage.
- [ ] Back up the file somewhere other than the laptop it lives on.
