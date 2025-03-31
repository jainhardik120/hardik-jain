'use client';

import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { File, Folder, MoreHorizontal, Download, Trash, Edit, Share, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { api } from '@/server/api/react';

import ShareDialog from './share-dialog';

interface FileListProps {
  files: Array<{
    key: string;
    size: number;
    lastModified: Date;
    isFolder: boolean;
  }>;
  currentPath: string;
  onNavigate: (path: string) => void;
  selectedItems: string[];
  onSelectItem: (key: string, isSelected: boolean) => void;
  onRefresh: () => void;
}

export default function FileList({
  files,
  currentPath,
  onNavigate,
  selectedItems,
  onSelectItem,
  onRefresh,
}: FileListProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [itemToRename, setItemToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [itemToShare, setItemToShare] = useState<string | null>(null);

  const downloadMutation = api.files.getDownloadUrl.useMutation();
  const renameMutation = api.files.rename.useMutation({
    onSuccess: () => {
      onRefresh();
      setIsRenaming(false);
      setItemToRename(null);
      setNewName('');
      toast({
        title: 'Item renamed',
        description: 'Your item has been renamed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error renaming item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  const deleteMutation = api.files.delete.useMutation({
    onSuccess: () => {
      onRefresh();
      setIsDeleting(false);
      setItemToDelete(null);
      toast({
        title: 'Item deleted',
        description: 'Your item has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDownload = async (key: string) => {
    try {
      const result = await downloadMutation.mutateAsync({ key });
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch {
      toast({
        title: 'Error downloading file',
        description: 'There was an error generating the download link.',
        variant: 'destructive',
      });
    }
  };

  const handleRename = (key: string) => {
    setItemToRename(key);
    // Extract the file/folder name from the key
    const name = key.split('/').filter(Boolean).pop() ?? '';
    setNewName(name);
    setIsRenaming(true);
  };

  const handleDelete = (key: string) => {
    setItemToDelete(key);
    setIsDeleting(true);
  };

  const handleShare = (key: string) => {
    setItemToShare(key);
    setIsSharing(true);
  };

  const confirmRename = () => {
    if (itemToRename === null || !itemToRename || !newName) {
      return;
    }

    const isFolder = itemToRename.endsWith('/');
    const parentPath = currentPath;

    // For folders, we need to ensure the trailing slash
    const newKey = isFolder ? `${parentPath}${newName}/` : `${parentPath}${newName}`;

    renameMutation.mutate({
      oldKey: itemToRename,
      newKey,
      isFolder,
    });
  };

  const confirmDelete = () => {
    if (itemToDelete === null) {
      return;
    }

    deleteMutation.mutate({
      key: itemToDelete,
      isFolder: itemToDelete.endsWith('/'),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="w-8 p-3">{/* Checkbox for select all could go here */}</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3 hidden md:table-cell">Size</th>
            <th className="text-left p-3 hidden md:table-cell">Modified</th>
            <th className="w-10 p-3"></th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-8 text-muted-foreground">
                This folder is empty
              </td>
            </tr>
          ) : (
            files.map((file) => {
              // Extract the display name from the key
              const displayName = file.key.split('/').filter(Boolean).pop() ?? file.key;

              return (
                <tr key={file.key} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedItems.includes(file.key)}
                      onCheckedChange={(checked) => onSelectItem(file.key, checked === true)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {file.isFolder ? (
                        <Folder className="h-5 w-5 text-blue-500" />
                      ) : (
                        <File className="h-5 w-5 text-gray-500" />
                      )}
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                          if (file.isFolder) {
                            onNavigate(file.key);
                          }
                        }}
                      >
                        {displayName}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {file.isFolder ? '—' : formatFileSize(file.size)}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {formatDistanceToNow(file.lastModified, { addSuffix: true })}
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!file.isFolder && (
                          <DropdownMenuItem onClick={() => handleDownload(file.key)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleRename(file.key)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        {!file.isFolder && (
                          <DropdownMenuItem onClick={() => handleShare(file.key)}>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(file.key)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenaming(false);
                setItemToRename(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRename}
              disabled={newName.length === 0 || renameMutation.isPending}
            >
              {renameMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleting(false);
                setItemToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isSharing && itemToShare !== null && itemToShare && (
        <ShareDialog
          fileKey={itemToShare}
          isOpen={isSharing}
          onClose={() => {
            setIsSharing(false);
            setItemToShare(null);
          }}
        />
      )}
    </div>
  );
}
