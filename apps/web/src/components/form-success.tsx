import { cn } from '@/lib/utils';

export default function FormMessage({
  message,
  isError,
}: {
  message: string | undefined;
  isError?: boolean;
}) {
  return (
    <div
      className={cn(
        `flex items-center gap-x-2 text-sm ${isError === true ? 'text-destructive' : 'text-emerald-500'}`,
      )}
    >
      <p>{message}</p>
    </div>
  );
}
