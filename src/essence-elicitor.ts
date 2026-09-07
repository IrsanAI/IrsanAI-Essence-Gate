/**
 * Essence Elicitor — fragt nach der Essence des Ziels
 * Kern deiner Idee: Anfragender besitzt Vorstellung des Ergebnisses -> abgleichen
 */

export interface ElicitationResult {
  originalIntent: string;
  bestExistingRef: string | null;
  guessedEssenceId: string;
  guessedEssenceName: string;
  guessedEssenceCapability: string;
  guessedEssenceDescription: string;
  questionsAsked: string[];
  userAnswers?: string[]; // in real flow gefüllt
}

const ELICIT_QUESTIONS = [
  "Was ist die Essence deines gewünschten Ergebnisses? Nicht WIE du es baust, sondern WAS muss die Fähigkeit können damit du sagst 'fertig'?",
  "Welche Entscheidung willst du am Ende treffen können?",
  "Stell dir vor die Essence existiert schon — was wäre ein konkretes Input -> Output Beispiel?"
];

export async function elicitEssenceGoal(intentText: string, bestExisting: { essence: { id: string } } | null): Promise<ElicitationResult> {
  const lower = intentText.toLowerCase();
  
  // Heuristik v0.1 — später LLM call (gemini-2-5-flash / claude-sonnet-4-6 aus IS)
  let guessedId = 'custom-essence';
  let guessedName = 'Custom Essence';
  let guessedCap = intentText.slice(0, 120);
  let guessedDesc = intentText;

  if (lower.includes('gold') || lower.includes('preis') || lower.includes('verkauf')) {
    guessedId = 'gold-decision-support';
    guessedName = 'Gold Decision Support';
    guessedCap = 'Zuverlässige Entscheidungshilfe wann Gold verkaufen/halten, mit Begründung basierend auf Preis-Trends und Risiko';
    guessedDesc = 'Essence für Gold Buddy: Trackt Gold Preis real-time, analysiert Trends via SelfAnalyzer, gibt Sell/Hold Signal mit reasoning. Abgeleitet aus real-time-grounding + deep-reasoning';
  } else if (lower.includes('repo') || lower.includes('essence') || lower.includes('gate')) {
    guessedId = 'essence-gatekeeper';
    guessedName = 'Essence Gatekeeper';
    guessedCap = 'Prüft ob Vorhaben zu bestehender Essence passt, elicited Essence des Ziels, erstellt neue Essence wenn Lücke';
    guessedDesc = 'Meta-Essence für EG: Matches intent gegen Essence Library, fragt nach Ziel-Essence, drafted neue essence.json';
  }

  return {
    originalIntent: intentText,
    bestExistingRef: bestExisting?.essence.id ?? null,
    guessedEssenceId: guessedId,
    guessedEssenceName: guessedName,
    guessedEssenceCapability: guessedCap,
    guessedEssenceDescription: guessedDesc,
    questionsAsked: ELICIT_QUESTIONS
  };
}
