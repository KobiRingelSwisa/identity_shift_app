import { z } from 'zod';

/** Loose structural validation — keeps CI safe without duplicating every step field in TS. */
const stepSchema = z.object({ type: z.string() }).passthrough();

export const programSchema = z.object({
  track: z.object({
    id: z.string(),
    title: z.string(),
    duration_days: z.number().int().positive(),
    estimated_session_minutes: z.number(),
  }),
  days: z
    .array(
      z.object({
        day: z.number().int().positive(),
        theme: z.string(),
        steps: z.array(stepSchema),
      })
    )
    .min(1),
});

export type ProgramSchemaInferred = z.infer<typeof programSchema>;
