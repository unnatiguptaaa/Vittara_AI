import { useEffect, useRef } from 'react';

// Pointer lighting runs once per frame without rerendering the component.
export default function useTilt(intensity = 6) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!element) return;
    let frame;
    const reset = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty('--rotate-x', '0deg');
      element.style.setProperty('--rotate-y', '0deg');
      element.style.setProperty('--pointer-x', '50%');
      element.style.setProperty('--pointer-y', '50%');
    };
    const move = (event) => {
      if (!query.matches) return;
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--rotate-x', `${(0.5 - y) * intensity}deg`);
        element.style.setProperty('--rotate-y', `${(x - 0.5) * intensity}deg`);
        element.style.setProperty('--pointer-x', `${x * 100}%`);
        element.style.setProperty('--pointer-y', `${y * 100}%`);
      });
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', reset);
    query.addEventListener('change', reset);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      query.removeEventListener('change', reset);
    };
  }, [intensity]);
  return ref;
}
