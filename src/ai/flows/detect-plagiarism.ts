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
  analysis: z.string().describe('A detailed analysis of the text, highlighting potentially plagiarized sections and their sources.'),
  plagiarismScore: z.number().min(0).max(100).describe('The overall plagiarism score as a percentage (0-100), representing the likelihood of plagiarism.'),
  uniquenessScore: z.number().min(0).max(100).describe('The percentage of the text that is unique (0-100).'),
  matches: z.array(z.object({
    text: z.string().describe('The matched text snippet from the original document.'),
    source: z.string().describe('The URL of the source where the similar text was found.'),
    similarity: z.number().min(0).max(100).describe('The similarity score for this specific match as a percentage (0-100).')
  })).describe('A list of specific text matches found on the web.'),
});
export type DetectPlagiarismOutput = z.infer<typeof DetectPlagiarismOutputSchema>;

export async function detectPlagiarism(input: DetectPlagiarismInput): Promise<DetectPlagiarismOutput> {
  return detectPlagiarismFlow(input);
}

const detectPlagiarismPrompt = ai.definePrompt({
  name: 'detectPlagiarismPrompt',
  input: {schema: DetectPlagiarismInputSchema},
  output: {schema: DetectPlagiarismOutputSchema},
  prompt: `You are a sophisticated plagiarism detection tool. Your task is to analyze the following text, search the web for any matching or similar content, and provide a detailed report.

Text to analyze:
{{{text}}}

Please perform a thorough web search to find any sources that contain parts of this text.

Based on your findings, provide:
1.  A detailed analysis that highlights plagiarized sections. For each section, cite the source URL.
2.  An overall plagiarism score from 0 to 100, where 100 means definite plagiarism.
3.  A uniqueness score from 0 to 100, representing the percentage of original content.
4.  A list of all matched snippets, including the snippet, the source URL, and a similarity percentage for that snippet.

If no plagiarism is detected, the plagiarism score should be 0, uniqueness score should be 100, and the matches array should be empty.`,
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
