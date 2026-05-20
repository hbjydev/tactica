import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { PublicFooter } from '@/components/views/public/footer';
import { PublicHeader } from '@/components/views/public/header';
import { login, register } from '@/routes/index';
import { create } from '@/routes/public/unit';
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
