'use server';

import { detectPlagiarism, DetectPlagiarismInput, DetectPlagiarismOutput } from '@/ai/flows/detect-plagiarism';

export async function analyzeText(text: string): Promise<{ data: DetectPlagiarismOutput | null; error: string | null }> {
  if (!text || text.trim().length < 50) {
      return { data: null, error: 'Please enter text with at least 50 characters.' };
  }
  if (text.trim().length > 10000) {
      return { data: null, error: 'Text must not be longer than 10,000 characters.' };
  }

  const input: DetectPlagiarismInput = { text };

  try {
    const result = await detectPlagiarism(input);
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unexpected error occurred during analysis.' };
  }
}
