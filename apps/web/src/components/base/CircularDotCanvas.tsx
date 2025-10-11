'use client';
import { useEffect, useRef } from 'react';

interface CircularDotsCanvasProps {
    circleX?: number;
    circleY?: number;
    innerRadius?: number;
    outerRadius?: number;
    dotGap?: number;
}

export default function CircularDotsCanvas({
    circleX,
    circleY,
    innerRadius = 300,
    outerRadius = 550,
    dotGap = 17,
}: CircularDotsCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const cx = circleX ?? window.innerWidth - 250;
        const cy = circleY ?? window.innerHeight / 2 - 228;

        const dots: { x: number; y: number; size: number }[] = [];

        // Initialize grid dots
        for (let y = 0; y < canvas.height; y += dotGap) {
            for (let x = 0; x < canvas.width + 200; x += dotGap) {
                dots.push({ x, y, size: 1 });
            }
        }

        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);

            for (const dot of dots) {
                // Move dots slowly
                dot.x -= 0.25;
                if (dot.x < -50) dot.x = canvas!.width + 50;

                // Distance from circle center
                const dx = dot.x - cx;
                const dy = dot.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let size = 1;

                if (dist >= innerRadius && dist <= outerRadius) {
                    const ringWidth = outerRadius - innerRadius;
                    const normalized = (dist - innerRadius) / ringWidth; // 0 -> 1

                    size = 1 + Math.sin(normalized * Math.PI) * 4.5;
                }

                dot.size = size;

                const fadeMargin = 100; // distance over which opacity fades
                const fadeLeft = Math.min(dot.x / fadeMargin, 1) * 0.4; // stronger fade on left
                const fadeRight = Math.min((canvas!.width - dot.x) / fadeMargin, 1);
                const fadeTop = Math.min(dot.y / fadeMargin, 1);
                const fadeBottom = Math.min((canvas!.height - dot.y) / fadeMargin, 1);

                const opacity = Math.max(0.05, Math.min(fadeLeft, fadeRight, fadeTop, fadeBottom));

                ctx.fillStyle = `rgba(237, 61, 38, ${opacity.toFixed(10)})`;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [circleX, circleY, innerRadius, outerRadius, dotGap]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-none brightness-150"
        />
    );
}
