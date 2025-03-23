'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import type { Snippet } from '@prisma/client';

export const PublicSnippetsFilter = ({ initialSnippets }: { initialSnippets: Snippet[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams?.get('query') ?? '');
  const [language, setLanguage] = useState(searchParams?.get('language') ?? '');
  const [tag, setTag] = useState(searchParams?.get('tag') ?? '');

  // Extract unique languages and tags from snippets
  const languages = useMemo(
    () => Array.from(new Set(initialSnippets.map((s) => s.language))),
    [initialSnippets],
  );
  const allTags = useMemo(
    () => Array.from(new Set(initialSnippets.flatMap((s) => s.tags))).sort(),
    [initialSnippets],
  );

  // Update URL with filters
  const updateFilters = () => {
    const params = new URLSearchParams();
    if (query) {
      params.set('query', query);
    }
    if (language) {
      params.set('language', language);
    }
    if (tag) {
      params.set('tag', tag);
    }

    router.push(`/snippets?${params.toString()}`);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  // Clear all filters
  const clearFilters = () => {
    setQuery('');
    setLanguage('');
    setTag('');
    router.push('/snippets');
  };

  return (
    <div className="bg-card border rounded-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search snippets..."
              className="pl-10"
            />
          </div>

          <div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="capitalize">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger>
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {(query || language || tag) && (
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground py-1">Active filters:</p>
                {query && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Search: {query}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setQuery('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {language && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Language: {language}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setLanguage('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {tag && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Tag: {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => setTag('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {(query || language || tag) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            <Button type="submit" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Apply filters
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
