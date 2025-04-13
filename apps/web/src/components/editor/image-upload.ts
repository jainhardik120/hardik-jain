import { createImageUpload } from 'novel';
import { toast } from 'sonner';

import { onUpload } from '@/lib/image-upload';

export const uploadFn = createImageUpload({
  onUpload: async (file) => {
    return await onUpload(file);
  },
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.');

      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).');

      return false;
    }

    return true;
  },
});
