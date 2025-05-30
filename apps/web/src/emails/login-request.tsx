import React from 'react';

import { Tailwind, Button, Html } from '@react-email/components';

import config from 'tailwind.config';

const Email = ({ resetLink }: { resetLink: string }) => {
  return (
    <Tailwind config={config}>
      <Html>
        <Button
          href={resetLink}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Click to login to your account
        </Button>
      </Html>
    </Tailwind>
  );
};

export default Email;
