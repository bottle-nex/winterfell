'use client';
import { useEffect } from 'react';

type ShortcutHandler = () => void;

interface ShortcutProps {
    [combo: string]: ShortcutHandler;
}

/**
 *
 * @param shortcuts stores shortcut combinatiosn
 */

export default function useShortcuts(shortcuts: ShortcutProps) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const key = e.key === 'Dead' ? '`' : e.key.toLowerCase();
            const combo = [];

            switch (true) {
                case e.metaKey && e.ctrlKey:
                    combo.push('meta', 'ctrl');
                    break;
                case e.ctrlKey && e.shiftKey:
                    combo.push('ctrl', 'shift');
                    break;
                case e.metaKey:
                    combo.push('meta');
                    break;
                case e.ctrlKey:
                    combo.push('ctrl');
                    break;
            }

            combo.push(key);

            const combo_string = combo.join('+');
            const handler = shortcuts[combo_string];

            if (handler) {
                e.preventDefault();
                handler();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
