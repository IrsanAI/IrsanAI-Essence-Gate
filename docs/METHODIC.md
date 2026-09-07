# IrsanAI-Essence-Gate — METHODIC.md — Single Source of Truth — This file IS the Initial

Snapshot: ccfa73d -> 6f74854 — 13/13 valid GRÜN
Build Gate: npm install && npx tsx scripts/validate-registry.ts --verbose -> 13 valid GRÜN
Registry: 12 seed from IS (browser-control, code-generation, deep-reasoning, filesystem-access, instruction-following, is-router-core a0dfb88 meta-essence, long-context-reasoning, metacognitive-eval, multi-agent-coordination, mythos-advanced-reasoning, real-time-grounding, vision-understanding) +1 gold-decision-support (first consumer)

Source: src/gatekeeper.ts (Decide), src/essence-matcher.ts (Observe/Orient), src/essence-elicitor.ts (Elicit), packages/schemas/src/essence.schema.ts (compatible passthrough)

Consumer Usage:
const EG_BASE = 'https://raw.githubusercontent.com/IrsanAI/IrsanAI-Essence-Gate/main/registry/essences';
fetch(`${EG_BASE}/gold-decision-support.json`)

No local copy — Single Source of Truth stays EG.

Ecosystem: Engine IS 1441a04 https://github.com/IrsanAI/IrsanAI-IS , Consumer 1 GB 4010ade https://github.com/IrsanAI/IrsanAI-Gold-Buddy

Pattern: Request -> TaskClassifier -> gatekeep() vs 13 -> if <0.8 Elicitor -> Creator draft new essence.json -> PR to EG -> validate GRÜN -> usable by all.
