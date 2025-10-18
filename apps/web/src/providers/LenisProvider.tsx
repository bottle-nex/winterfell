import { ReactLenis } from 'lenis/react';

interface LenisProviderProps {
    children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.03, // Lower = smoother
                duration: 1.8, // Higher = more glide
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.8, // Lower for softer scroll
                touchMultiplier: 1.5,
            }}
        >
            {children}
        </ReactLenis>
    );
}
