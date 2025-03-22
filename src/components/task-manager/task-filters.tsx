'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryState } from '@/lib/use-query-state';

export function TaskFilters() {
  const [search, setSearch] = useQueryState('search');
  const [priority, setPriority] = useQueryState('priority');
  const [assignee, setAssignee] = useQueryState('assignee');
  const [inputValue, setInputValue] = useState(search ?? '');

  // Update input value when search query param changes
  useEffect(() => {
    setInputValue(search ?? '');
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue || null);
  };

  const clearFilters = () => {
    setSearch(null);
    setPriority(null);
    setAssignee(null);
    setInputValue('');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
        <Input
          placeholder="Search tasks..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="rounded-r-none w-full"
        />
        <Button type="submit" variant="secondary" className="rounded-l-none px-2">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>

      <Select value={priority ?? ''} onValueChange={(value) => setPriority(value || null)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select value={assignee ?? ''} onValueChange={(value) => setAssignee(value || null)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectItem value="john">John Doe</SelectItem>
          <SelectItem value="jane">Jane Smith</SelectItem>
          <SelectItem value="bob">Bob Johnson</SelectItem>
        </SelectContent>
      </Select>

      {(search !== null || priority !== null || assignee !== null) && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  );
}
