import { useState, useEffect, useCallback } from 'react';

interface UseTerminalResizeProps {
    onClose: () => void;
}

export function useTerminalResize({ onClose }: UseTerminalResizeProps) {
    const [height, setHeight] = useState(220);
    const [isResizing, setIsResizing] = useState(false);

    const startResize = useCallback(() => {
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const doResize = (e: MouseEvent) => {
            if (!isResizing) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight < 50) {
                onClose();
                setIsResizing(false);
                return;
            }
            if (newHeight > 100 && newHeight < 600) setHeight(newHeight);
        };

        const stopResize = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }

        return () => {
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing, onClose]);

    return {
        height,
        startResize,
    };
}
