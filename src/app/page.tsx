import { PlagiarismChecker } from '@/components/plagiarism-checker';
import { FileCheck2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <FileCheck2 className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">EchoScan</h1>
        </div>
      </header>
      <main className="flex-1">
        <PlagiarismChecker />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-sm leading-loose text-center text-muted-foreground">
              Built with ♥ by Aayush Mishra.
            </p>
        </div>
      </footer>
    </div>
  );
}
