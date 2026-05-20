import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes/index';
import { create } from '@/routes/public/unit';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function MarketingLayout({ children }: Props) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <a href={login.url()} className="flex items-center gap-2.5 font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight">Tactica</span>
                    </a>

                    <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                        <a href="#features" className="transition-colors hover:text-foreground">Features</a>
                        <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <a href={login.url()}>Login</a>
                        </Button>
                        <Button size="sm" asChild>
                            <a href={create.url()}>Create a unit</a>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t border-border/50 py-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
                            <AppLogoIcon className="size-3.5 fill-current" />
                        </div>
                        <span className="font-medium text-foreground">Tactica</span>
                    </div>
                    <span>&copy; {new Date().getFullYear()} Tactica. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
