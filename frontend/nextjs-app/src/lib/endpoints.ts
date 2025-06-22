import 'server-only';
import z from 'zod/v4';

export const ENDPOINTS = {
  test: 'http://localhost/api/',
} as const;

export type SourceId = keyof typeof ENDPOINTS;

export const IdSchema = z.enum(Object.keys(ENDPOINTS) as [SourceId, ...SourceId[]]);
