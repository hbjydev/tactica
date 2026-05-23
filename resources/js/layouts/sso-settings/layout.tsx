import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/wayfinder/routes/sso/appearance';
import { edit as profile } from '@/wayfinder/routes/sso/profile';
import { edit as editSecurity } from '@/wayfinder/routes/sso/security';
import type { NavItem } from '@/types';
import { LockIcon, LogOutIcon, MonitorIcon, UserIcon } from 'lucide-react';
import { logout } from '@/wayfinder/routes';
import { Card, CardContent } from '@/components/ui/card';
import { UnitSwitcher } from '@/components/unit-switcher';

export default function SsoSettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const {
        props: {
            auth: { units },
        },
    } = usePage();

    const sidebarNavItems: NavItem[] = [
        {
            id: 'profile',
            type: 'link',
            requiredPermissions: 0,
            title: 'Profile',
            href: profile(),
            icon: UserIcon,
        },
        {
            id: 'security',
            type: 'link',
            requiredPermissions: 0,
            title: 'Security',
            href: editSecurity(),
            icon: LockIcon,
        },
        {
            id: 'appearance',
            type: 'link',
            requiredPermissions: 0,
            title: 'Appearance',
            href: editAppearance(),
            icon: MonitorIcon,
        },
        {
            id: 'logout',
            type: 'link',
            requiredPermissions: 0,
            title: 'Log out',
            href: logout(),
            icon: LogOutIcon,
        },
    ];

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.filter(x => x.type == 'link').map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <Separator className="my-4" />

                    <div className="flex flex-col gap-y-2">
                        <span className="px-2 text-sm text-muted-foreground">
                            Back to a unit:
                        </span>
                        <UnitSwitcher units={units} inSidebar={false} />
                    </div>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <Card className="max-w-xl space-y-12">
                        <CardContent className="flex flex-col gap-y-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
