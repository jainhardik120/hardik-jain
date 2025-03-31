'use client';

import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { AchievementsList } from '@/types/constants';

const AnimatedNumbers = dynamic(() => import('./AnimatedNumber'), {
  ssr: false,
});

const AchievementsSection = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="md:mt-16 xl:gap-16 sm:w-full">
      <div className="md:px-16 flex flex-row items-center justify-between">
        {AchievementsList.map((achievement, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center mx-4 my-4 md:my-0"
            >
              <h2 className="text-lg md:text-4xl font-bold flex flex-row items-center">
                {achievement.prefix}
                <div className="relative inline-block">
                  <span
                    className={'text-lg md:text-4xl font-bold px-0.5 inline-block opacity-0'}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {achievement.value}
                  </span>

                  <span
                    className={`text-lg md:text-4xl font-bold px-0.5 absolute top-0 left-0 ${isClient ? 'opacity-0' : ''}`}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    0
                  </span>

                  {isClient && (
                    <span className="absolute top-0 left-0">
                      <AnimatedNumbers
                        includeComma
                        animateToNumber={parseInt(achievement.value)}
                        locale="en-US"
                        className="text-lg md:text-4xl font-bold px-0.5"
                      />
                    </span>
                  )}
                </div>

                {achievement.postfix}
              </h2>
              <p className="text-muted-foreground text-base">{achievement.metric}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSection;
