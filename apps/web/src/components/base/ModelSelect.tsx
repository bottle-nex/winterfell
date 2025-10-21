import { Select, SelectTrigger, SelectContent, SelectItem } from '@/src/components/ui/select';
import Image from 'next/image';

type ModelType = 'gemini' | 'claude';

interface ModelSelectProps {
    value: ModelType;
    onChange: (value: ModelType) => void;
}

export default function ModelSelect({ value, onChange }: ModelSelectProps) {
    return (
        <Select value={value} onValueChange={(val) => onChange(val as ModelType)}>
            <SelectTrigger className="w-28 h-8 text-xs bg-neutral-900/40 border-neutral-800 text-neutral-300 flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Image
                        src={value === 'gemini' ? '/icons/gemini.png' : '/icons/claude.png'}
                        alt={value}
                        width={14}
                        height={14}
                        unoptimized
                        className="rounded-sm"
                    />
                    <span className="capitalize">{value}</span>
                </div>
            </SelectTrigger>

            <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                <SelectItem value="gemini" className="text-xs flex items-center gap-2">
                    <Image
                        src="/icons/gemini.png"
                        alt="Gemini"
                        width={14}
                        height={14}
                        unoptimized
                    />
                    Gemini
                </SelectItem>
                <SelectItem value="claude" className="text-xs flex items-center gap-2">
                    <Image
                        src="/icons/claude.png"
                        alt="Claude"
                        width={14}
                        height={14}
                        unoptimized
                    />
                    Claude
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
