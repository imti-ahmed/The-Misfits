"use client";

import { useEffect, useState } from 'react';
import styles from './ResolutionIndicator.module.css';

export default function ResolutionIndicator() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (size.width === 0) return null;

  return (
    <div className={styles.indicator}>
      {size.width} × {size.height}
    </div>
  );
}
