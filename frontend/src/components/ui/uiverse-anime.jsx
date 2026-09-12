import React, { useEffect, useRef } from 'react';
import * as animeModule from 'animejs';
import { cn } from '@/lib/utils';

const anime = animeModule.animate || animeModule;
const stagger = animeModule.stagger || anime.stagger;

/**
 * AnimeStagger Component
 * Uses Anime.js to trigger a fluid staggered spring/bounce entrance animation for child elements.
 */
export const AnimeStagger = ({
  children,
  className,
  staggerDelay = 80,
  translateY = [30, 0],
  duration = 900,
  easing = 'easeOutElastic(1, .8)',
  ...props
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.children;
    if (!elements || elements.length === 0) return;

    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: translateY,
      scale: [0.92, 1],
      delay: anime.stagger(staggerDelay, { start: 100 }),
      duration: duration,
      easing: easing,
    });
  }, [staggerDelay, duration, easing, translateY]);

  return (
    <div ref={containerRef} className={cn(className)} {...props}>
      {children}
    </div>
  );
};

/**
 * AnimeMagnetic Component
 * Wraps interactive elements (buttons, cards, badges) to provide a smooth 3D magnetic cursor pull effect.
 */
export const AnimeMagnetic = ({
  children,
  className,
  strength = 0.35,
  ...props
}) => {
  const targetRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

    anime({
      targets: targetRef.current,
      translateX: x,
      translateY: y,
      rotateX: -y * 0.5,
      rotateY: x * 0.5,
      duration: 400,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    if (!targetRef.current) return;
    anime({
      targets: targetRef.current,
      translateX: 0,
      translateY: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 750,
      easing: 'easeOutElastic(1, .5)',
    });
  };

  return (
    <div
      ref={targetRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block transition-transform duration-100 ease-out preserve-3d', className)}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * AnimeText Reveal Component
 * Splices typography into individual kinetic characters animated via Anime.js.
 */
export const AnimeText = ({
  text = '',
  className,
  staggerDelay = 40,
  ...props
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    const letters = textRef.current.querySelectorAll('.anime-letter');

    anime({
      targets: letters,
      opacity: [0, 1],
      translateY: [20, 0],
      translateZ: [0, 0],
      rotateZ: [10, 0],
      scale: [0.5, 1],
      delay: anime.stagger(staggerDelay),
      duration: 800,
      easing: 'easeOutBack',
    });
  }, [text, staggerDelay]);

  return (
    <span ref={textRef} className={cn('inline-block overflow-hidden', className)} {...props}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="anime-letter inline-block opacity-0 preserve-3d"
          style={{ whitespace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default {
  AnimeStagger,
  AnimeMagnetic,
  AnimeText,
};
