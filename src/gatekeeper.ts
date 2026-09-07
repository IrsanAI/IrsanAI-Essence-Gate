/**
 * IrsanAI-Essence-Gate — Gatekeeper
 * v0.1.0 — Based on IrsanAI-IS 8-class rule (TaskClassifier + LoadoutRouter + SelfAnalyzer + SelfOptimizer)
 */

import { EssenceSchema, type Essence } from '../packages/schemas/src/essence.schema.js';
import { matchEssence, type MatchResult } from './essence-matcher.js';
import { elicitEssenceGoal, type ElicitationResult } from './essence-elicitor.js';

export interface GateRequest {
  id: string;
  requester: 'human' | 'agent' | 'llm';
  intentText: string; // "Ich will Gold tracken..."
  context?: Record<string, unknown>;
}

export interface GateDecision {
  matched: MatchResult[];
  bestMatch: MatchResult | null;
  shouldCreateNew: boolean;
  elicitationNeeded: boolean;
  elicitation?: ElicitationResult;
  newEssenceDraft?: Essence;
  suggestedLoadout?: { id: string; essenceIds: string[] };
  reasoning: string;
}

export async function gatekeep(request: GateRequest, allEssences: Essence[]): Promise<GateDecision> {
  // 1. Match against existing 12 essences
  const matches = matchEssence(request.intentText, allEssences);
  const best = matches[0] || null;
  const confidence = best?.confidence ?? 0;

  // 2. Decide
  if (confidence >= 0.85) {
    return {
      matched: matches,
      bestMatch: best,
      shouldCreateNew: false,
      elicitationNeeded: false,
      suggestedLoadout: {
        id: `${best.id}-loadout`,
        essenceIds: [best.id]
      },
      reasoning: `High confidence ${confidence.toFixed(2)} -> existing essence ${best.id} sufficient (is-router-core pattern)`
    };
  }

  // 3. Elicitation needed — frage nach Essence des Ziels
  const elicitation = await elicitEssenceGoal(request.intentText, best);

  // 4. Re-match mit elicited essence guess
  const refinedMatches = matchEssence(elicitation.guessedEssenceCapability, allEssences);
  const refinedBest = refinedMatches[0] || null;

  if (refinedBest && refinedBest.confidence >= 0.8) {
    return {
      matched: refinedMatches,
      bestMatch: refinedBest,
      shouldCreateNew: false,
      elicitationNeeded: true,
      elicitation,
      suggestedLoadout: {
        id: `${refinedBest.id}-refined`,
        essenceIds: [refinedBest.id]
      },
      reasoning: `After elicitation, ${refinedBest.id} matches ${refinedBest.confidence.toFixed(2)} -> no new essence needed`
    };
  }

  // 5. Create new essence draft
  const newId = elicitation.guessedEssenceId;
  const draft: Essence = {
    id: newId,
    name: elicitation.guessedEssenceName,
    version: '0.1.0',
    description: elicitation.guessedEssenceDescription,
    capability: elicitation.guessedEssenceCapability,
    tags: ['auto-generated', 'gatekeeper', request.requester],
    systemPrompt: `You are the ${newId} essence. ${elicitation.guessedEssenceCapability}`,
    fewShotExamples: [],
    relatedLoadouts: [],
    relatedModels: matches.slice(0, 3).map(m => m.essence.id),
    confidenceThreshold: 0.8,
    source: {
      derivedFrom: best?.essence.id,
      repo: 'IrsanAI-Essence-Gate'
    },
    elicitationQuestions: [
      "Was ist die Essence deines gewünschten Ergebnisses? Nicht WIE, sondern WAS muss die Fähigkeit können damit du sagst 'fertig'?",
      "Welche Entscheidung willst du am Ende treffen können?",
      "Was wäre ein konkretes Beispiel für Input -> Output dieser Essence?"
    ],
    isMetaEssence: false
  };

  // Validate draft
  const parsed = EssenceSchema.safeParse(draft);
  if (!parsed.success) {
    throw new Error(`Draft essence invalid: ${parsed.error.message}`);
  }

  return {
    matched: matches,
    bestMatch: best,
    shouldCreateNew: true,
    elicitationNeeded: true,
    elicitation,
    newEssenceDraft: parsed.data,
    suggestedLoadout: {
      id: newId,
      essenceIds: [...matches.slice(0,2).map(m => m.essence.id), newId]
    },
    reasoning: `Gap detected. Best existing ${best?.essence.id ?? 'none'} only ${confidence.toFixed(2)}. Drafted new essence ${newId} from elicited goal: "${elicitation.guessedEssenceCapability}"`
  };
}
