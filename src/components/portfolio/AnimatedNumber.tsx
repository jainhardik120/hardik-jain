import React from 'react';
import type { Transition } from 'motion/react';
import { motion, useAnimation, useInView } from 'motion/react';

const NUMBERS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

interface Props {
  className?: string;
  animateToNumber: number;
  fontStyle?: React.CSSProperties;
  transitions?: (index: number) => Transition;
  includeComma?: boolean;
  locale?: string;
}

const AnimatedNumber = ({
  className,
  animateToNumber,
  fontStyle,
  transitions,
  includeComma,
  locale,
}: Props) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const controls = useAnimation();
  const animateTonumberString =
    includeComma !== undefined
      ? Math.abs(animateToNumber).toLocaleString(locale ?? 'en-US')
      : String(Math.abs(animateToNumber));
  const animateToNumbersArr = Array.from(animateTonumberString, Number).map((x, idx) =>
    isNaN(x) ? animateTonumberString[idx] : x,
  );

  const [numberHeight, setNumberHeight] = React.useState(0);
  const [numberWidth, setNumberWidth] = React.useState(0);
  const [hasStartedAnimation, setHasStartedAnimation] = React.useState(false);

  const numberDivRef = React.useRef<HTMLDivElement>(null);

  // Function to update dimensions
  const updateDimensions = React.useCallback(() => {
    const rect = numberDivRef.current?.getClientRects()?.[0];
    if (rect) {
      setNumberHeight(rect.height);
      setNumberWidth(rect.width);

      // Reset animation if it has already started and dimensions change
      if (hasStartedAnimation) {
        controls.stop();
        controls.set('hidden');
        setTimeout(() => {
          void controls.start('visible');
        }, 50);
      }
    }
  }, [controls, hasStartedAnimation]);

  // Initial measurement
  React.useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // Add resize listener with debounce
  React.useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDimensions();
      }, 100); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [updateDimensions]);

  React.useEffect(() => {
    if (isInView && numberHeight > 0) {
      setHasStartedAnimation(true);
      void controls.start('visible');
    }
  }, [isInView, numberHeight, controls]);

  // Key for forcing re-render when dimensions change
  const dimensionKey = `${numberHeight}_${numberWidth}`;

  return (
    <span ref={ref}>
      {numberHeight !== 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
          }}
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
                style={{
                  height: numberHeight,
                  width: numberWidth,
                }}
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
                transition={transitions?.(index)}
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

const Enhanced = React.memo(AnimatedNumber, (prevProps, nextProps) => {
  return (
    prevProps.animateToNumber === nextProps.animateToNumber &&
    prevProps.fontStyle === nextProps.fontStyle &&
    prevProps.includeComma === nextProps.includeComma &&
    JSON.stringify(prevProps.fontStyle) === JSON.stringify(nextProps.fontStyle)
  );
});

export default Enhanced;
