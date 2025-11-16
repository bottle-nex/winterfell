import { contents } from '@/src/const/docsSidebarValues';
import { useState, useEffect, useRef } from 'react';
import { useActiveContentStore } from '@/src/store/docs/useActiveContentStore';

export default function ClientDocsRightSidebar() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { activeContent } = useActiveContentStore();
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const displayContent = contents.find((item) => item.type === activeContent);

    useEffect(() => {
        setActiveIndex(0);
    }, [activeContent]);

    useEffect(() => {
        if (!displayContent?.subSections || displayContent.subSections.length === 0) {
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -66% 0px',
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        };

        const visibleSections = new Map<string, number>();

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            if (isScrollingRef.current) return;

            entries.forEach((entry) => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    visibleSections.set(sectionId, entry.intersectionRatio);
                } else {
                    visibleSections.delete(sectionId);
                }
            });

            let maxRatio = 0;
            let topSection = '';
            visibleSections.forEach((ratio, id) => {
                if (ratio > maxRatio) {
                    maxRatio = ratio;
                    topSection = id;
                }
            });

            if (topSection) {
                const index = displayContent.subSections!.findIndex((sub) => sub.id === topSection);
                if (index !== -1 && index !== activeIndex) {
                    setActiveIndex(index);
                }
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        setTimeout(() => {
            displayContent.subSections!.forEach((sub) => {
                const element = document.getElementById(sub.id);
                if (element) {
                    observer.observe(element);
                } else {
                    console.warn(`Element with id "${sub.id}" not found`);
                }
            });
        }, 100);

        return () => {
            observer.disconnect();
            visibleSections.clear();
        };
    }, [displayContent, activeIndex]);

    function calculatePosition(index: number) {
        return index * 38;
    }

    const handleClick = (index: number, subId: string) => {
        isScrollingRef.current = true;
        setActiveIndex(index);

        const sectionEl = document.getElementById(subId);
        if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 1000);
    };

    if (!displayContent?.subSections || displayContent.subSections.length === 0) {
        return null;
    }

    return (
        <div className="h-full z-50 fixed w-[20vw] flex flex-col top-22 items-start px-8">
            <div className="flex flex-col gap-y-5 text-left text-xs tracking-wide text-light/70 relative">
                <div
                    className="absolute -left-4 top-4 h-3 w-0.5 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(108,68,252,0.8)] transition-all duration-500 ease-out"
                    style={{
                        top: `${calculatePosition(activeIndex)}px`,
                    }}
                />
                {displayContent.subSections.map((sub, index) => (
                    <span
                        key={sub.id}
                        onClick={() => handleClick(index, sub.id)}
                        className={`tracking-wider select-none relative transition-colors duration-300 cursor-pointer text-[13px]
                            ${activeIndex === index ? 'text-white' : 'hover:text-white'}
                        `}
                    >
                        {sub.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
