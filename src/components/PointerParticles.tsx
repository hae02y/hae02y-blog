'use client';

import { useEffect, useRef } from 'react';

import styles from './PointerParticles.module.css';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  born: number;
  lifetime: number;
};

const MAX_PARTICLES = 144;
const TRAIL_SPACING = 7;

export default function PointerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mouseAvailable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    let enabled = false;
    let particles: Particle[] = [];
    let previous: { x: number; y: number } | null = null;
    let frame: number | null = null;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let fill = '';
    let outline = '';

    const readPalette = () => {
      const style = getComputedStyle(canvas);
      fill = style.getPropertyValue('--particle-fill').trim();
      outline = style.getPropertyValue('--particle-outline').trim();
    };

    const clear = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastFrame = 0;
      previous = null;
      particles = [];
      context.clearRect(0, 0, width, height);
    };

    const resize = () => {
      clear();
      if (!enabled) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const draw = (now: number) => {
      frame = null;
      const elapsed = lastFrame ? Math.min((now - lastFrame) / 1000, 0.034) : 1 / 60;
      lastFrame = now;
      context.clearRect(0, 0, width, height);
      context.fillStyle = fill;
      context.strokeStyle = outline;
      context.lineWidth = 0.5;

      particles = particles.filter(particle => now - particle.born < particle.lifetime);
      for (const particle of particles) {
        const remaining = 1 - (now - particle.born) / particle.lifetime;
        particle.x += particle.vx * elapsed;
        particle.y += particle.vy * elapsed;
        particle.vy += 16 * elapsed;
        const drag = Math.pow(0.97, elapsed * 60);
        particle.vx *= drag;
        particle.vy *= drag;
        context.globalAlpha = 0.75 * remaining * remaining;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * (0.6 + remaining * 0.4), 0, Math.PI * 2);
        context.fill();
        context.stroke();
      }
      context.globalAlpha = 1;

      // No animation loop remains after the last dot fades.
      if (particles.length) frame = requestAnimationFrame(draw);
      else lastFrame = 0;
    };

    const animate = () => {
      if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
      if (frame === null) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (!enabled || document.hidden || event.pointerType !== 'mouse') return;
      const { clientX: x, clientY: y } = event;
      if (!previous) {
        previous = { x, y };
        return;
      }
      const dx = x - previous.x;
      const dy = y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < TRAIL_SPACING) return;
      const count = Math.min(Math.floor(distance / TRAIL_SPACING), 10);
      const now = performance.now();
      for (let i = 1; i <= count; i++) {
        const progress = i / count;
        particles.push({
          x: previous.x + dx * progress + (Math.random() - 0.5) * 5,
          y: previous.y + dy * progress + (Math.random() - 0.5) * 5,
          vx: -dx / distance * 12 + (Math.random() - 0.5) * 16,
          vy: -dy / distance * 12 + (Math.random() - 0.5) * 16,
          radius: 0.9 + Math.random() * 0.9,
          born: now,
          lifetime: 400 + Math.random() * 260,
        });
      }
      previous = { x, y };
      animate();
    };

    const onPress = (event: PointerEvent) => {
      if (!enabled || document.hidden || event.pointerType !== 'mouse' || event.button !== 0) return;
      const now = performance.now();
      for (let i = 0; i < 24; i++) {
        const angle = i / 24 * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = 35 + Math.random() * 95;
        particles.push({
          x: event.clientX + Math.cos(angle) * 3,
          y: event.clientY + Math.sin(angle) * 3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 1.2,
          born: now,
          lifetime: 550 + Math.random() * 300,
        });
      }
      animate();
    };

    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) previous = null;
    };

    const syncPreferences = () => {
      enabled = !reducedMotion.matches && mouseAvailable.matches;
      clear();
      if (enabled) resize();
      else canvas.width = canvas.height = 0;
    };

    readPalette();
    syncPreferences();
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    reducedMotion.addEventListener('change', syncPreferences);
    mouseAvailable.addEventListener('change', syncPreferences);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerout', onLeave, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);

    return () => {
      clear();
      themeObserver.disconnect();
      reducedMotion.removeEventListener('change', syncPreferences);
      mouseAvailable.removeEventListener('change', syncPreferences);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerout', onLeave);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', clear);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} data-pointer-particles aria-hidden="true" />;
}
