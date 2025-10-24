import Image from 'next/image';
import React from 'react';
import { FaGitAlt } from 'react-icons/fa';
import {
    SiRust,
    SiTypescript,
    SiJavascript,
    SiToml,
    SiMarkdown,
    SiSolidity,
    SiYaml,
} from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';

import { VscLock, VscFile } from 'react-icons/vsc';

interface FileIconProps {
    filename: string;
    size?: number;
    className?: string;
}

export default function FileIcon({ filename, size = 16, className = '' }: FileIconProps) {
    const getFileExtension = (name: string): string => {
        const parts = name.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
    };

    const extension = getFileExtension(filename);

    const renderIcon = () => {
        switch (extension) {
            case 'rs':
                return <SiRust size={size} color="#CE422B" className={`${className}`} />;

            case 'ts':
            case 'tsx':
                return (
                    <SiTypescript
                        size={11}
                        color="#3178C6"
                        className={`text-[#3178C6] ${className}`}
                    />
                );

            case 'js':
            case 'jsx':
                return (
                    <SiJavascript
                        size={size}
                        color="#F7DF1E"
                        className={`text-[#F7DF1E] ${className}`}
                    />
                );

            case 'toml':
                return (
                    <SiToml size={size} color="#9C4221" className={`text-[#9C4221] ${className}`} />
                );

            case 'gitignore':
                return (
                    <FaGitAlt size={17} color="#f05133" className={`text-[#f05133] ${className}`} />
                );

            case 'prettierignore':
                return <Image height={15} width={15} src="/icons/prettier.png" alt="Prettier" />;

            case 'json':
                return (
                    <VscJson
                        size={size}
                        color="#42a63e"
                        className={`text-[#399551] ${className}`}
                    />
                );

            case 'md':
            case 'markdown':
                return (
                    <SiMarkdown
                        size={size}
                        color="#083FA1"
                        className={`text-[#083FA1] ${className}`}
                    />
                );

            case 'sol':
                return (
                    <SiSolidity
                        size={size}
                        color="#AA9785"
                        className={`text-[#AA9785] ${className}`}
                    />
                );

            case 'yaml':
            case 'yml':
                return (
                    <SiYaml size={size} color="#CB171E" className={`text-[#CB171E] ${className}`} />
                );

            case 'lock':
                return <VscLock size={size} className={`text-neutral-600 ${className}`} />;

            default:
                return (
                    <VscFile
                        size={size}
                        color="#353838hcv"
                        className={`text-neutral-500 ${className}`}
                    />
                );
        }
    };

    return <div className="flex items-center justify-center">{renderIcon()}</div>;
}
