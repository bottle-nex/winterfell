import { useEffect, useState } from 'react';

export function useShortcutMenuToggle() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            const isCmd = e.metaKey || e.ctrlKey;
            const isQuestion = e.key === '/';

            if (isCmd && isQuestion) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        }

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return { open, setOpen };
}
