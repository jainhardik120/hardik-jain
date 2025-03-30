'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { api } from '@/server/api/react';
import { toast } from '@/hooks/use-toast';

interface ShareDialogProps {
  fileKey: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareDialog({ fileKey, isOpen, onClose }: ShareDialogProps) {
  const [expiresIn, setExpiresIn] = useState('1h');
  const [shareUrl, setShareUrl] = useState('');

  const createShareMutation = api.shares.createShare.useMutation({
    onSuccess: (data) => {
      setShareUrl(data.shareUrl);
    },
    onError: (error) => {
      toast({
        title: 'Error creating share link',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { data: existingShares, isLoading: isLoadingShares } = api.shares.getSharesByFile.useQuery(
    { fileKey },
    { enabled: isOpen },
  );

  useEffect(() => {
    if (existingShares && existingShares.length > 0) {
      setShareUrl(existingShares[0]?.shareUrl ?? '');
    }
  }, [existingShares]);

  const handleCreateShare = () => {
    // Convert expiresIn to milliseconds
    let expirationMs: number;

    switch (expiresIn) {
      case '1h':
        expirationMs = 60 * 60 * 1000;
        break;
      case '24h':
        expirationMs = 24 * 60 * 60 * 1000;
        break;
      case '7d':
        expirationMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        expirationMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        expirationMs = 60 * 60 * 1000; // Default to 1 hour
    }

    createShareMutation.mutate({
      fileKey,
      expiresIn: expirationMs,
    });
  };

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: 'Link copied',
        description: 'Share link copied to clipboard',
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isLoadingShares ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : shareUrl ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {existingShares && existingShares.length > 0 && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expires {new Date(existingShares[0]?.expiresAt ?? 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Link expires after:</span>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateShare}
                disabled={createShareMutation.isPending}
                className="w-full"
              >
                {createShareMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Generate Share Link
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
