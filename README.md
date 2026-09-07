# IrsanAI-Essence-Gate — Single Source of Truth for all essences

Build Gate: `npx tsx scripts/validate-registry.ts --verbose` -> 13/13 valid GRÜN (6f74854)

This repo is Hub. All other repos are Consumers that fetch remote.

## 🧭 IRSANAI Ecosystem V1 — How to use without local files

- Engine: [IrsanAI-IS 1441a04](https://github.com/IrsanAI/IrsanAI-IS) — 22 valid
- Hub: This repo 6f74854 — 13/13 GRÜN
- Consumer 1: [IrsanAI-Gold-Buddy 4010ade](https://github.com/IrsanAI/IrsanAI-Gold-Buddy) — decision-support buddy (not finance bot)

No `IS_INITIAL_*.txt` needed. See `docs/METHODIC.md` — it embeds full Initial.

Usage: `const EG_BASE = 'https://raw.githubusercontent.com/IrsanAI/IrsanAI-Essence-Gate/main/registry/essences'`

Pattern: Request -> TaskClassifier essenceGuess -> gatekeep() vs 13 -> Match >=0.8 or Elicitor.

See `docs/METHODIC.md` + `docs/IRSANAI_2030_PATTERN.md`
