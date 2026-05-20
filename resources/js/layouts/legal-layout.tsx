import type { ReactNode } from 'react';
import { PublicFooter } from '@/components/views/public/footer';
import { PublicHeader } from '@/components/views/public/header';

interface Props {
    children: ReactNode;
    title: string;
    updatedAt?: string;
}

export default function LegalLayout({ children, title, updatedAt }: Props) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <PublicHeader />

            <main className="flex-1">
                {/* page title band */}
                <div className="border-b border-border/40 bg-muted/20 px-6 py-12">
                    <div className="mx-auto max-w-5xl">
                        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            Legal
                        </p>
                        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            {title}
                        </h1>
                        {updatedAt && (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Last updated: {updatedAt}
                            </p>
                        )}
                    </div>
                </div>

                {/* prose content */}
                <div className="mx-auto max-w-5xl px-6 py-12">
                    {children}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
