import './animations.css';

function Cube({ offset }: { offset: number }) {
  return (
    <div className="scene" style={{ ['--rotation-offset' as string]: `${offset}deg` }}>
      <div className="cube">
        <div className="cube__face cube__face--front">front</div>
        <div className="cube__face cube__face--back">back</div>
        <div className="cube__face cube__face--right">right</div>
        <div className="cube__face cube__face--left">left</div>
      </div>
    </div>
  );
}

export default function AnimationsPage() {
  const cubes = Array.from({ length: 50 }).map((_, i) => {
    const offset = i * 7.5;
    return <Cube key={i} offset={offset} />;
  });

  return (
    <div className="w-full h-screen flex flex-col bg-black items-center justify-center text-white">
      <div className="spiral">{cubes}</div>
    </div>
  );
}
