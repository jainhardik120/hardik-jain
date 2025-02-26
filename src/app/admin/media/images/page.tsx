'use client';

import canvaAuth from '@/actions/canvaAuth';
import DesignList from '@/components/canva/list-designs';
import { Button } from '@/components/ui/button';

export default function ImagePage() {
  return (
    <>
      <Button
        onClick={async () => {
          await canvaAuth();
        }}
      >
        Authenticate canva
      </Button>
      <DesignList />
    </>
  );
}
