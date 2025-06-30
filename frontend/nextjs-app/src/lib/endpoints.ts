import 'server-only';
import z from 'zod/v4';

export const ENDPOINTS = {
  test: 'http://backend_fastapi:8000/api/v1/bedrock/status',
} as const;

export type SourceId = keyof typeof ENDPOINTS;

export const IdSchema = z.enum(Object.keys(ENDPOINTS) as [SourceId, ...SourceId[]]);
