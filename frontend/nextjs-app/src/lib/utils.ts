import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function enumFromConst<T extends readonly [string, ...string[]]>(values: T) {
  return z.enum([...values] as [T[number], ...T[number][]]);
}
