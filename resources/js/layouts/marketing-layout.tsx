import { PublicFooter } from '@/components/views/public/footer';
import { PublicHeader } from '@/components/views/public/header';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function MarketingLayout({ children }: Props) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <PublicHeader />

            <main className="flex-1">
                {children}
            </main>

            <PublicFooter />
        </div>
    );
}
