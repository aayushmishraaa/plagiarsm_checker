'use server';

/**
 * @fileOverview Detects plagiarism in a given text using AI.
 *
 * - detectPlagiarism - A function that takes text input and returns analysis results highlighting potentially plagiarized sections.
 * - DetectPlagiarismInput - The input type for the detectPlagiarism function.
 * - DetectPlagiarismOutput - The return type for the detectPlagiarism function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectPlagiarismInputSchema = z.object({
  text: z.string().describe('The text to analyze for plagiarism.'),
});
export type DetectPlagiarismInput = z.infer<typeof DetectPlagiarismInputSchema>;

const DetectPlagiarismOutputSchema = z.object({
  analysis: z.string().describe('The analysis results, highlighting potentially plagiarized sections.'),
  confidence: z.number().describe('The confidence level of the plagiarism detection (0-1).'),
});
export type DetectPlagiarismOutput = z.infer<typeof DetectPlagiarismOutputSchema>;

export async function detectPlagiarism(input: DetectPlagiarismInput): Promise<DetectPlagiarismOutput> {
  return detectPlagiarismFlow(input);
}

const detectPlagiarismPrompt = ai.definePrompt({
  name: 'detectPlagiarismPrompt',
  input: {schema: DetectPlagiarismInputSchema},
  output: {schema: DetectPlagiarismOutputSchema},
  prompt: `Analyze the following text for plagiarism and highlight any potentially plagiarized sections. Also, provide a confidence score (0-1) for the plagiarism detection.\n\nText: {{{text}}}`,
});

const detectPlagiarismFlow = ai.defineFlow(
  {
    name: 'detectPlagiarismFlow',
    inputSchema: DetectPlagiarismInputSchema,
    outputSchema: DetectPlagiarismOutputSchema,
  },
  async input => {
    const {output} = await detectPlagiarismPrompt(input);
    return output!;
  }
);
