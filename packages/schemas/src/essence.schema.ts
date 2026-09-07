import { z } from 'zod';

// Kompatibel mit IS v1.0.2 (12 alte) + EG v0.1.0 (gold)
export const EssenceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional().default('unnamed'),
  version: z.string().optional().default('1.0.0'),
  description: z.string().optional().default(''),
  capability: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  systemPrompt: z.string().optional(),
  fewShotExamples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    reasoning: z.string().optional()
  })).optional().default([]),
  evalNotes: z.string().optional(),
  ports: z.array(z.string()).optional(),
  relatedLoadouts: z.array(z.string()).optional().default([]),
  relatedModels: z.array(z.string()).optional().default([]),
  confidenceThreshold: z.number().optional().default(0.8),
  source: z.object({
    repo: z.string().optional(),
    commit: z.string().optional(),
    derivedFrom: z.string().optional()
  }).passthrough().optional(),
  elicitationQuestions: z.array(z.string()).optional(),
  isMetaEssence: z.boolean().optional().default(false)
}).passthrough();

export type Essence = z.infer<typeof EssenceSchema>;
export const EssenceArraySchema = z.array(EssenceSchema);
