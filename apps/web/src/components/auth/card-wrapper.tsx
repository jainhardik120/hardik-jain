import Link from 'next/link';

import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader } from '@repo/ui/card';

import { Social } from '@/components/auth/social';

import type { Route } from 'next';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: Route;
  showSocial?: boolean;
}

export function CardWrapper({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader>
        <p className="text-center text-lg font-bold">{headerLabel}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        {children}
        {showSocial !== undefined && showSocial && <Social />}
        <Button variant="link" size="sm" className="w-full font-normal" asChild>
          <Link href={backButtonHref} className="text-sm text-muted-foreground">
            {backButtonLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
