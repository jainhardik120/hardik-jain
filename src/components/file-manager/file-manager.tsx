'use client';

import { useState } from 'react';
import FileList from './file-list';
import FileUpload from './file-upload';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/server/api/react';
import { toast } from '@/hooks/use-toast';

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { data: files, isLoading, refetch } = api.files.list.useQuery({ prefix: currentPath });
  const createFolderMutation = api.files.createFolder.useMutation({
    onSuccess: () => {
      void refetch();
      setIsCreatingFolder(false);
      setNewFolderName('');
      toast({
        title: 'Folder created',
        description: 'Your folder has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating folder',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const handleCreateFolder = () => {
    if (!newFolderName) {
      return;
    }

    const folderPath = currentPath ? `${currentPath}${newFolderName}/` : `${newFolderName}/`;
    createFolderMutation.mutate({ path: folderPath });
  };

  const handleSelectItem = (key: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems([...selectedItems, key]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== key));
    }
  };

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCreatingFolder(true)}
            disabled={isCreatingFolder}
          >
            New Folder
          </Button>
          {isCreatingFolder && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="px-2 py-1 border rounded"
                placeholder="Folder name"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleCreateFolder}
                disabled={!newFolderName || createFolderMutation.isPending}
              >
                {createFolderMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Create'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <FileUpload currentPath={currentPath} onUploadComplete={() => refetch()} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <FileList
          files={files || []}
          currentPath={currentPath}
          onNavigate={handleNavigate}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onRefresh={() => refetch()}
        />
      )}
    </div>
  );
}
