'use client';

import { useEffect, useState } from 'react';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1178;

export default function ScaleWrapper({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_WIDTH);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: scale !== null ? `${DESIGN_HEIGHT * scale}px` : '0px',
      }}
    >
      <div
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transformOrigin: 'top left',
          transform: `scale(${scale ?? 1})`,
          visibility: scale !== null ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
