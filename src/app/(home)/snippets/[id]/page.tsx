import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const snippet = await api.snippet.getSnippetById({ id: (await params).id });
  return {
    title: snippet?.title ?? 'Snippet Not Found',
  };
}

const SnippetDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const snippet = await api.snippet.getSnippetById({ id: (await params).id });

  if (!snippet) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6">
        <Link href="/snippets">
          <Button variant="ghost" className="flex items-center gap-2 px-0">
            <ArrowLeft size={16} />
            Back to snippets
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{snippet.title || 'Untitled Snippet'}</h1>
          {snippet.description && (
            <p className="text-lg text-muted-foreground">{snippet.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {snippet.language}
          </Badge>
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Code</h2>
          <pre className="bg-card p-4 rounded-md overflow-x-auto font-mono text-sm">
            {snippet.code}
          </pre>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Created: {new Date(snippet.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(snippet.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailPage;
