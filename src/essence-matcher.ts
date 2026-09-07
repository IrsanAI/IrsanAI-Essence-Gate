import type { Essence } from '../packages/schemas/src/essence.schema.js';

export interface MatchResult {
  essence: Essence;
  confidence: number; // 0-1
  reasoning: string;
  matchedTerms: string[];
}

// Simple matcher v0.1 — später vector similarity (pgvector)
// Basis: IrsanAI-IS TaskClassifier pattern

export function matchEssence(intentText: string, essences: Essence[]): MatchResult[] {
  const lower = intentText.toLowerCase();
  const terms = lower.split(/\W+/).filter(Boolean);

  const results: MatchResult[] = essences.map(ess => {
    const haystack = `${ess.id} ${ess.name} ${ess.description} ${ess.capability} ${ess.tags.join(' ')}`.toLowerCase();
    let score = 0;
    const matched: string[] = [];
    for (const t of terms) {
      if (t.length < 3) continue;
      if (haystack.includes(t)) {
        score += 1;
        matched.push(t);
      }
    }
    // Boost for exact capability words
    if (haystack.includes(lower.slice(0, 30))) score += 2;
    
    const confidence = Math.min(1, score / Math.max(5, terms.length * 0.6));
    return {
      essence: ess,
      confidence,
      reasoning: `Matched ${matched.length} terms: ${matched.slice(0,5).join(', ')} in ${ess.id}`,
      matchedTerms: matched
    };
  });

  return results.sort((a,b) => b.confidence - a.confidence);
}
