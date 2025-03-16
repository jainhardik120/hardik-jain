'use client';

import { AvatarImage } from '@/components/ui/avatar';
import React, { useRef } from 'react';

const RandomAvatarImage = ({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string | null | undefined;
}) => {
  const randomAvatar = useRef(
    // eslint-disable-next-line max-len
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`,
  );

  return <AvatarImage src={src ?? randomAvatar.current} alt={alt ?? ''} />;
};

export default RandomAvatarImage;
