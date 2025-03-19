import { api } from '@/server/api/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Code, Clock, Tag } from 'lucide-react';
import { PublicSnippetsFilter } from './PublicSnippetsFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Snippets Library',
  description: 'Browse our collection of useful code snippets for various programming languages',
};

const PublicSnippetsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; language?: string; tag?: string }>;
}) => {
  const { query, language, tag } = await searchParams;

  const snippets = await api.snippet.searchSnippets({
    query: query ?? undefined,
    language: language ?? undefined,
    tags: tag !== null && tag !== undefined ? [tag] : undefined,
  });

  return (
    <main className="w-full p-4 mx-auto gap-y-4 flex flex-col pt-8">
      <div className="text-center mb-10">
        <h1 className="mb-4 font-bold">Code Snippets Library</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of useful code snippets for various programming languages
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <aside className="md:max-w-64 shrink-0">
          <PublicSnippetsFilter initialSnippets={snippets} />
        </aside>

        <section className="flex-1">
          {snippets.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {snippets.map((snippet) => (
                <Link key={snippet.id} href={`/snippets/${snippet.id}`} className="group">
                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden transition-all duration-300 h-full hover:shadow-md group-hover:border-primary">
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          {snippet.language}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
                        </Badge>
                      </div>

                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {snippet.title || 'Untitled Snippet'}
                      </h2>

                      {snippet.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {snippet.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mt-auto">
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {snippet.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{snippet.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No snippets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PublicSnippetsPage;
