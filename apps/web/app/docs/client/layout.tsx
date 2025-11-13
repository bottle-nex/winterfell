import LenisProvider from '@/src/providers/LenisProvider';
import React, { JSX } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
    return <LenisProvider>{children}</LenisProvider>;
}
