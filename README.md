# IrsanAI-Essence-Gate (EG)

> **Central gate for all IrsanAI essences. Validates, matches & creates portable capabilities.**
> Built on IrsanAI-IS v1.0.2 (1441a04) Root-Ascent v0.4 + 8-Class Product Rule | Build Gate GRÜN Termux

## Purpose

IrsanAI-IS hat 22 files valid (5 models, 12 essences inkl. is-router-core.json, 3 loadouts, 2 agents). Problem: Jedes neue Repo (Gold Buddy, LiveShare, ...) kopiert `registry/essences/` lokal -> Drift.

**EG löst das:** Ein einziges Repo als Source of Truth für alle Essenzen.

- **Gatekeeper:** Entscheidet ob Vorhaben zu bestehender Essence passt
- **Matcher:** TaskClassifier extrahiert geglaubte Essence des Ziels aus Freitext
- **Elicitor:** Fragt "Was ist die Essence deines gewünschten Ergebnisses?" wenn Confidence < 0.8
- **Creator:** Drafted neue essence.json nach Zod Schema, validiert, committet, bietet sofort an

## Architecture — 8-Class Rule aus IrsanAI-IS

Produkt = nur was `packages/is-core/src/index.ts` head 40 importiert (aus IS v1.0.2):
1. ModelRegistry
2. EssenceLibrary (jetzt remote -> EG)
3. LoadoutManager (fragt EG)
4. TaskClassifier (extrahiert essence guess)
5. LoadoutRouter
6. PerformanceTracker
7. SelfAnalyzer
8. SelfOptimizer

Scaffold = apps/is-dashboard, turbo (android-arm64 not supported), examples/, docs/, scripts/

Verbot: `photon|renderHost|Viewer|Landing|FileSystem|Transport` -> 0 Treffer (LiveShare v1.0.4 Begriffe nicht in IS/EG)

## Flow — Dein gewünschter Abgleich

```
Requester: "Ich will Gold tracken und wissen wann verkaufen"

-> TaskClassifier: essenceGuess = { name: "gold-decision-support", capability: "decision help when to sell gold with reasoning" }

-> EssenceLibrary (EG): search 12 essences
   real-time-grounding 0.72, deep-reasoning 0.51, NO 0.9+

-> Gatekeeper: confidence < 0.8 -> Elicitor fragt:
   "Was ist die Essence deines Ziels? Nicht WIE du es baust, sondern was muss die Fähigkeit können damit du sagst 'fertig'?"

-> Requester: "Zuverlässige Entscheidungshilfe wann Gold verkaufen, mit Begründung"

-> SelfAnalyzer: Gap = keine Essence für decision-support-trading

-> Creator: Draft registry/essences/gold-decision-support.json
   validate:registry --verbose -> 23 files all valid

-> LoadoutManager: Neues Loadout gold-intelligence = [real-time-grounding + deep-reasoning + gold-decision-support]
   Sofort angeboten an Requester
```

## Registry Stand (Seed aus IrsanAI-IS 1441a04)

- Models: 5 (aus IS)
- Essences: 12 inkl. is-router-core.json (NEU a0dfb88) -> Ziel 200+ 2030
- Loadouts: 3 (planning-strategy, research-synthesis, software-engineering) -> Ziel 20+ auto-generated
- Agents: 2 + Gold Buddy (neu)

## Gold Buddy Integration

Gold Buddy = Erster Consumer, nicht Gate selbst.
- Agent `gold-buddy.json`: Nutzt TaskClassifier + Elicitor im Frontend
- Stellt Frage nach Essence des Ziels
- EG ist Backend das validiert + erstellt

## Build Gate Termux (gleich wie IS)

```bash
pnpm -F @irsanai/schemas build
npx tsc -p packages/schemas --noEmit
npx tsc -p src --noEmit
npx tsx scripts/validate-registry.ts --verbose
# [EG:validate:registry] 12 files -> 13 -> ... all valid
```

## Related Repos

- IrsanAI-IS v1.0.2 (1441a04): https://github.com/IrsanAI/IrsanAI-IS — Engine mit 8 Klassen
- Gold Buddy (planned): Consumer von EG
- LiveShare v1.0.4: Basis für Root-Ascent Prinzip

---
IrsanAI-EG v0.1.0 Root-Ascent v0.4 + 8-Class Rule + Gatekeeper + is-router-core as first meta-essence + Gold Buddy as first consumer
