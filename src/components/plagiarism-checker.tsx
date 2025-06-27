"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, Loader2, ScanText, FileCheck2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { analyzeText } from '@/app/actions';
import type { DetectPlagiarismOutput } from '@/ai/flows/detect-plagiarism';

const formSchema = z.object({
  text: z.string().min(50, {
    message: "Text must be at least 50 characters.",
  }).max(10000, {
    message: "Text must not be longer than 10,000 characters.",
  }),
});

export function PlagiarismChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectPlagiarismOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const { data, error } = await analyzeText(values.text);

    if (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error,
      });
    } else if (data) {
      setResult(data);
    }
    
    setIsLoading(false);
  }

  const handleDownload = () => {
    if (!result) return;

    const reportContent = `Veritas AI Plagiarism Report
==============================
Confidence Score: ${(result.confidence * 100).toFixed(0)}%
------------------------------
Analysis:
${result.analysis}
`;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'veritas-ai-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Check for Plagiarism</CardTitle>
            <CardDescription>Paste your text below to analyze it for potential plagiarism.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Text to analyze</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Start writing or paste your text here..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ScanText className="mr-2 h-4 w-4" />
                  )}
                  Analyze Text
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <div className="sticky top-24">
          {isLoading ? (
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                 </div>
                 <Separator />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
              <CardFooter>
                  <Skeleton className="h-10 w-40" />
              </CardFooter>
            </Card>
          ) : result ? (
            <Card className="shadow-lg animate-in fade-in">
              <CardHeader>
                <CardTitle className="font-headline">Analysis Results</CardTitle>
                <CardDescription>Review the analysis below. The confidence score indicates the likelihood of plagiarism.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-sm font-medium">Plagiarism Confidence</h3>
                         <span className="font-bold text-primary">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={result.confidence * 100} className="h-3 [&>div]:bg-primary" />
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-medium mb-2">Detailed Analysis</h3>
                    <div className="p-4 bg-secondary/50 rounded-md max-h-[250px] overflow-y-auto text-sm whitespace-pre-wrap font-mono">
                        {result.analysis}
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          ) : (
             <Card className="shadow-lg border-dashed">
                <CardHeader>
                    <CardTitle className="font-headline">Ready to Analyze</CardTitle>
                    <CardDescription>Your analysis results will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <FileCheck2 size={48} className="mx-auto" />
                        <p className="mt-4">Enter text on the left and click "Analyze Text" to begin.</p>
                    </div>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
