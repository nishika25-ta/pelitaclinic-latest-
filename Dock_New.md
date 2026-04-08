# MacOS Dock Component Code

This file contains all the code required to replicate the MacOS-style dock in your new project.

## 1. Required Dependencies
You will need the following libraries:
- `react`
- `lucide-react` (for icons)
- `framer-motion` (optional, but this implementation uses standard React state and CSS transitions for the bounce/scaling logic)
- `tailwind-css` (for utility classes)

## 2. Type Definitions (`types.ts`)
```typescript
import type { ReactElement } from 'react';

export type DockAppItem = {
  id: string;
  name: string;
  icon: ReactElement;
  isDivider?: boolean;
};
```

## 3. The Dock Component (`MacOSDock.tsx`)
```tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';

type MacOSDockProps = {
  apps: {
    id: string;
    name: string;
    icon: React.ReactElement;
    isDivider?: boolean;
  }[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
};

export function MacOSDock({ apps, onAppClick, openApps = [], className = '' }: MacOSDockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState(() => apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number>();
  const lastMouseMoveTime = useRef(0);

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        baseIconSize: 40,
        maxScale: 1.6,
        effectWidth: 200,
        baseSpacing: 10,
        padX: 16,
        padY: 10,
      };
    }
    const w = window.innerWidth;
    if (w < 360) {
      return { baseIconSize: 22, maxScale: 1.18, effectWidth: 100, baseSpacing: 3, padX: 8, padY: 6 };
    }
    if (w < 400) {
      return { baseIconSize: 24, maxScale: 1.22, effectWidth: 110, baseSpacing: 4, padX: 8, padY: 7 };
    }
    if (w < 480) {
      return { baseIconSize: 26, maxScale: 1.28, effectWidth: 125, baseSpacing: 5, padX: 10, padY: 8 };
    }
    if (w < 640) {
      return { baseIconSize: 30, maxScale: 1.38, effectWidth: 150, baseSpacing: 7, padX: 12, padY: 9 };
    }
    if (w < 768) {
      return { baseIconSize: 36, maxScale: 1.5, effectWidth: 180, baseSpacing: 9, padX: 14, padY: 10 };
    }
    return { baseIconSize: 42, maxScale: 1.65, effectWidth: 220, baseSpacing: 10, padX: 16, padY: 10 };
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth, baseSpacing, padX, padY } = config;
  const minScale = 1.0;

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null) => {
      if (mousePosition === null) return apps.map(() => minScale);
      return apps.map((_, index) => {
        const normalIconCenter = index * (baseIconSize + baseSpacing) + baseIconSize / 2;
        const minX = mousePosition - effectWidth / 2;
        const maxX = mousePosition + effectWidth / 2;
        if (normalIconCenter < minX || normalIconCenter > maxX) return minScale;
        const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
        const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
        const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
        return minScale + scaleFactor * (maxScale - minScale);
      });
    },
    [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]
  );

  const calculatePositions = useCallback(
    (scales: number[]) => {
      let currentX = 0;
      return scales.map((scale) => {
        const scaledWidth = baseIconSize * scale;
        const centerX = currentX + scaledWidth / 2;
        currentX += scaledWidth + baseSpacing;
        return centerX;
      });
    },
    [baseIconSize, baseSpacing]
  );

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    setCurrentScales(initialScales);
    setCurrentPositions(calculatePositions(initialScales));
  }, [apps, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.22 : 0.12;
    setCurrentScales((prev) => prev.map((curr, i) => curr + (targetScales[i] - curr) * lerpFactor));
    setCurrentPositions((prev) => prev.map((curr, i) => curr + (targetPositions[i] - curr) * lerpFactor));
    const needsUpdate =
      currentScales.some((s, i) => Math.abs(s - targetScales[i]) > 0.002) ||
      currentPositions.some((p, i) => Math.abs(p - targetPositions[i]) > 0.1);
    if (needsUpdate || mouseX !== null) animationFrameRef.current = requestAnimationFrame(animateToTarget);
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animateToTarget);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animateToTarget]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      setMouseX(e.clientX - rect.left - padX);
    }
  }, [padX]);

  const handleAppClick = (appId: string, index: number) => {
    const el = iconRefs.current[index];
    if (el) {
      el.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
      el.style.transform = `translateY(-12px)`;
      setTimeout(() => {
        el.style.transition = 'transform 0.4s cubic-bezier(0.5, 2, 0.5, 1)';
        el.style.transform = 'translateY(0px)';
      }, 200);
    }
    onAppClick(appId);
  };

  const horizontalPadding = padX * 2;
  const dockWidth =
    currentPositions.length > 0
      ? Math.max(...currentPositions.map((pos, i) => pos + (baseIconSize * currentScales[i]) / 2)) + horizontalPadding
      : apps.length * (baseIconSize + baseSpacing) - baseSpacing + horizontalPadding;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 max-w-[calc(100vw-12px)] -translate-x-1/2 sm:bottom-6 ${className}`}
    >
      <div
        ref={dockRef}
        className="backdrop-blur-2xl transition-all duration-300 ease-out flex items-center justify-center"
        style={{
          width: `${dockWidth}px`,
          background: 'rgba(12, 12, 12, 0.9)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.03)',
          padding: `${padY}px ${padX}px`,
          height: `${baseIconSize + padY * 2}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseX(null)}
      >
        <div className="relative w-full flex items-end" style={{ height: `${baseIconSize}px` }}>
          {apps.map((app, index) => {
            const scale = currentScales[index] ?? 1;
            const position = currentPositions[index] ?? 0;
            const scaledSize = baseIconSize * scale;
            return (
              <div
                key={app.id}
                ref={(el) => {
                  iconRefs.current[index] = el;
                }}
                className="absolute cursor-pointer flex flex-col items-center justify-center group"
                onClick={() => handleAppClick(app.id, index)}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: '1px',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  transformOrigin: 'bottom center',
                  zIndex: Math.round(scale * 10),
                }}
              >
                <div className="absolute -top-12 bg-white text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.2 rounded-md opacity-0 group-hover:opacity-100 transition-all transform -translate-y-1 group-hover:translate-y-0 shadow-xl pointer-events-none whitespace-nowrap">
                  {app.name}
                </div>
                <div
                  className={`flex items-center justify-center w-full h-full transition-colors ${
                    app.isDivider ? 'opacity-20' : 'text-white/60 group-hover:text-white'
                  }`}
                >
                  {React.cloneElement(app.icon, {
                    size: scaledSize * 0.58,
                    strokeWidth: app.isDivider ? 1 : 2,
                  } as any)}
                </div>
                {openApps.includes(app.id) && !app.isDivider && (
                  <div
                    className="absolute bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                    style={{
                      bottom: `-${Math.max(3, scaledSize * 0.1)}px`,
                      width: '2.5px',
                      height: '2.5px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

## 4. Usage Example (`Example.tsx`)
```tsx
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { MacOSDock } from './MacOSDock';

const apps = [
  { id: 'home', name: 'Home', icon: <Home /> },
  { id: 'about', name: 'About', icon: <User /> },
  { id: 'projects', name: 'Projects', icon: <Briefcase /> },
  {
    id: 'divider',
    name: '',
    icon: <div className="w-px h-full bg-white/20 mx-1.5" />,
    isDivider: true,
  },
  { id: 'contact', name: 'Contact', icon: <Mail /> },
];

export default function Layout() {
  const handleNav = (id: string) => console.log('Navigate to', id);

  return (
    <div className="bg-[#050505] min-h-screen">
      <MacOSDock 
        apps={apps} 
        onAppClick={handleNav} 
        openApps={['home']} 
      />
    </div>
  );
}
```
