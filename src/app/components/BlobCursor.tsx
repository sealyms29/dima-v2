import { useEffect, useRef } from 'react';

interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterStdDeviation?: number;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#d4af37',
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(0,0,0,0.5)',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterStdDeviation = 30,
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  zIndex = 100
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const isHoveringInteractiveRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      ) {
        isHoveringInteractiveRef.current = true;
      } else {
        isHoveringInteractiveRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      
      posRef.current.x += dx * 0.15;
      posRef.current.y += dy * 0.15;

      blobsRef.current.forEach((blob, i) => {
        if (!blob) return;
        
        const delay = i * 0.08;
        const blobX = posRef.current.x + (targetRef.current.x - posRef.current.x) * delay;
        const blobY = posRef.current.y + (targetRef.current.y - posRef.current.y) * delay;
        
        const size = sizes[i] || 60;
        const scale = isHoveringInteractiveRef.current ? 1.5 : 1;
        
        blob.style.transform = `translate(${blobX - size / 2}px, ${blobY - size / 2}px) scale(${scale})`;
        blob.style.opacity = isHoveringInteractiveRef.current ? '0.8' : String(opacities[i] || 0.6);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sizes, opacities]);

  // Hide on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && containerRef.current) {
      containerRef.current.style.display = 'none';
    }
  }, []);

  return (
    <>
      {useFilter && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="blob-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={filterStdDeviation} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex,
          overflow: 'hidden',
          ...(useFilter && { filter: 'url(#blob-filter)' })
        }}
      >
        {Array.from({ length: trailCount }).map((_, i) => {
          const size = sizes[i] || 60;
          const innerSize = innerSizes[i] || 20;
          const opacity = opacities[i] || 0.6;

          return (
            <div
              key={i}
              ref={(el) => {
                if (el) blobsRef.current[i] = el;
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: size,
                height: size,
                borderRadius: blobType === 'circle' ? '50%' : '20%',
                background: fillColor,
                opacity,
                boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
                transition: `opacity ${fastDuration}s ease, transform ${slowDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                willChange: 'transform, opacity'
              }}
            >
              <div
                style={{
                  width: innerSize,
                  height: innerSize,
                  borderRadius: blobType === 'circle' ? '50%' : '15%',
                  background: innerColor
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
