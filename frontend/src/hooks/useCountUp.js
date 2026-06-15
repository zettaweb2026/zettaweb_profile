import { useState, useEffect } from 'react';

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms.
 * Only starts when `inView` becomes true.
 */
const useCountUp = (target, duration = 1500, inView = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Parse the numeric part from strings like "150+", "5+"
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
    const suffix = String(target).replace(/[0-9.]/g, ''); // e.g. "+" or "%"

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericTarget);
      }
    };

    const raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const suffix = String(target).replace(/[0-9.]/g, '');
  return `${count}${suffix}`;
};

export default useCountUp;
