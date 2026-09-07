import { z } from 'zod';

// Canonical Essence Schema — aus IrsanAI-IS v1.0.2 (packages/schemas/src/essence.schema.ts)
// Erweitert um gatekeeper Felder für EG

export const EssenceSchema = z.object({
  id: z.string().min(1).describe('kebab-case id, z.B. is-router-core'),
  name: z.string().min(1),
  version: z.string().default('1.0.0'),
  description: z.string().min(10),
  capability: z.string().min(10).describe('Was kann diese Essence? Portable Fähigkeit'),
  tags: z.array(z.string()).default([]),
  systemPrompt: z.string().optional().describe('Blueprint prompt'),
  fewShotExamples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    reasoning: z.string().optional()
  })).default([]),
  evalNotes: z.string().optional(),
  ports: z.array(z.string()).optional().describe('Abhängigkeiten wie SessionRepository etc.'),
  relatedLoadouts: z.array(z.string()).default([]),
  relatedModels: z.array(z.string()).default([]),
  confidenceThreshold: z.number().min(0).max(1).default(0.8),
  source: z.object({
    repo: z.string().optional(),
    commit: z.string().optional(),
    derivedFrom: z.string().optional()
  }).optional(),
  // Gatekeeper extension
  elicitationQuestions: z.array(z.string()).optional().describe('Fragen um Essence des Ziels zu erfragen'),
  isMetaEssence: z.boolean().default(false).describe('z.B. is-router-core ist meta')
});

export type Essence = z.infer<typeof EssenceSchema>;

export const EssenceArraySchema = z.array(EssenceSchema);
