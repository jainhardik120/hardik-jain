import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

import { motion, useAnimation, useInView } from 'motion/react';

const NUMBERS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

interface Props {
  className?: string;
  animateToNumber: number;
  fontStyle?: React.CSSProperties;
  includeComma?: boolean;
  locale?: string;
}

const AnimatedNumber = ({ className, animateToNumber, fontStyle, includeComma, locale }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const controls = useAnimation();
  const animateTonumberString =
    includeComma !== undefined
      ? Math.abs(animateToNumber).toLocaleString(locale ?? 'en-US')
      : String(Math.abs(animateToNumber));
  const animateToNumbersArr = Array.from(animateTonumberString, Number).map((x, idx) =>
    isNaN(x) ? animateTonumberString[idx] : x,
  );

  const [numberHeight, setNumberHeight] = useState(0);
  const [numberWidth, setNumberWidth] = useState(0);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

  const numberDivRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    const rect = numberDivRef.current?.getClientRects()?.[0];
    if (rect) {
      setNumberHeight(rect.height);
      setNumberWidth(rect.width);

      if (hasStartedAnimation) {
        controls.stop();
        controls.set('hidden');
        setTimeout(() => {
          void controls.start('visible');
        }, 50);
      }
    }
  }, [controls, hasStartedAnimation]);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDimensions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (isInView && numberHeight > 0) {
      setHasStartedAnimation(true);
      void controls.start('visible');
    }
  }, [isInView, numberHeight, controls]);

  const dimensionKey = `${numberHeight}_${numberWidth}`;

  return (
    <span ref={ref}>
      {numberHeight !== 0 && (
        <div
          style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}
          className={className}
          key={dimensionKey}
        >
          {animateToNumbersArr.map((n, index) => {
            if (typeof n === 'string') {
              return (
                <div
                  key={`${index}_${dimensionKey}`}
                  style={{ ...fontStyle, fontVariantNumeric: 'tabular-nums' }}
                >
                  {n}
                </div>
              );
            }

            return (
              <motion.div
                key={`${n}_${index}_${dimensionKey}`}
                style={{ height: numberHeight, width: numberWidth }}
                initial="hidden"
                variants={{
                  hidden: { y: 0 },
                  visible: {
                    y:
                      -1 *
                        (numberHeight *
                          (typeof animateToNumbersArr[index] === 'number'
                            ? animateToNumbersArr[index]
                            : 0)) -
                      numberHeight * 20,
                  },
                }}
                animate={controls}
              >
                {NUMBERS.map((number, idx) => (
                  <div
                    style={{ ...fontStyle, fontVariantNumeric: 'tabular-nums' }}
                    key={`${idx}_${dimensionKey}`}
                  >
                    {number}
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      )}

      <div ref={numberDivRef} style={{ position: 'absolute', top: -9999, ...fontStyle }}>
        {0}
      </div>
    </span>
  );
};

const Enhanced = memo(AnimatedNumber, (prevProps, nextProps) => {
  return (
    prevProps.animateToNumber === nextProps.animateToNumber &&
    prevProps.fontStyle === nextProps.fontStyle &&
    prevProps.includeComma === nextProps.includeComma &&
    JSON.stringify(prevProps.fontStyle) === JSON.stringify(nextProps.fontStyle)
  );
});

export default Enhanced;
