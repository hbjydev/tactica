import AppLogoIcon from '@/components/app-logo-icon';

export const PublicFooter = () => {
    return (
        <footer className="border-t border-border/50 py-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background">
                        <AppLogoIcon className="size-3.5 fill-current" />
                    </div>
                    <span className="font-medium text-foreground">Tactica</span>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="/terms"
                        className="transition-colors hover:text-foreground"
                    >
                        Terms
                    </a>
                    <a
                        href="/privacy"
                        className="transition-colors hover:text-foreground"
                    >
                        Privacy
                    </a>
                    <span>
                        &copy; {new Date().getFullYear()} Tactica. All rights
                        reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};
