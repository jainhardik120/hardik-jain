'use client';

import { useState, useEffect } from 'react';

import { Filter, Download, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { api } from '@/server/api/react';

import { useKanban } from './kanban-context';

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function FilterBar({ onExport }: { onExport: () => void }) {
  const { filters, setFilters, taskBoardId } = useKanban();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const data = api.tasks.getAllTags.useQuery();

  useEffect(() => {
    if (data.data !== null && data.data !== undefined) {
      setTags(data.data);
    }
  }, [data]);

  const addColumnMutation = api.tasks.addColumn.useMutation();
  const handleAddColumn = async () => {
    if (newColumnTitle.trim() === '') {
      return;
    }

    await addColumnMutation.mutateAsync({
      taskBoardId: taskBoardId,
      title: newColumnTitle,
    });
    setNewColumnTitle('');
    setIsAddColumnDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Filter by Tags</h4>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={filters.tags.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          setFilters((prev) => ({
                            ...prev,
                            tags:
                              checked === true
                                ? [...prev.tags, tag.id]
                                : prev.tags.filter((id) => id !== tag.id),
                          }));
                        }}
                      />
                      <Label
                        htmlFor={`tag-${tag.id}`}
                        className="flex items-center text-sm font-normal"
                      >
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Filter by Due Date</h4>
                <RadioGroup
                  value={filters.dueDate}
                  onValueChange={(value: 'all' | 'overdue' | 'today' | 'upcoming') => {
                    setFilters((prev) => ({
                      ...prev,
                      dueDate: value,
                    }));
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="due-all" />
                    <Label htmlFor="due-all" className="text-sm font-normal">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="overdue" id="due-overdue" />
                    <Label htmlFor="due-overdue" className="text-sm font-normal">
                      Overdue
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="due-today" />
                    <Label htmlFor="due-today" className="text-sm font-normal">
                      Today
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upcoming" id="due-upcoming" />
                    <Label htmlFor="due-upcoming" className="text-sm font-normal">
                      Upcoming
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    tags: [],
                    dueDate: 'all',
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="column-title">Column Title</Label>
              <Input
                id="column-title"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title..."
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddColumn}>Add Column</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="h-8" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
