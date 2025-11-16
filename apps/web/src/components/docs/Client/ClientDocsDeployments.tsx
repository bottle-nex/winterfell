import { JSX } from 'react';
import DocsHeading from '../../ui/DocsHeading';
import { cn } from '@/src/lib/utils';

export default function ClientDocsDeployments(): JSX.Element {
    return (
        <div
            className={cn(
                'w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className="flex justify-between items-end gap-y-1 px-1 w-full">
                <DocsHeading firstText="Winterfell" secondText="Deployments" />
            </div>
        </div>
    );
}
