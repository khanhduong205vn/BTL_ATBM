import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Generate particles
    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (8 + Math.random() * 4) + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Generate grid
    const grid = document.createElement('div');
    grid.className = 'fixed inset-0 opacity-10 pointer-events-none';
    grid.style.backgroundImage = `
      linear-gradient(rgba(255, 215, 0, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 215, 0, 0.08) 1px, transparent 1px)
    `;
    grid.style.backgroundSize = '60px 60px';
    grid.style.animation = 'gradient-flow 15s linear infinite';
    container.appendChild(grid);

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      if (grid.parentNode) {
        grid.parentNode.removeChild(grid);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
