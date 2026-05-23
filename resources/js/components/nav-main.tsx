import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { useAuth } from '@/state/auth';
import { hasPermission } from '@/lib/utils';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    return items.map((item) => <RenderNavItem key={item.id} item={item} />);
}

const RenderNavItem = ({ item }: { item: NavItem }) => {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const { publicPermissions } = usePage().props;
    const { user } = useAuth();
    const perms = user
        ? user.member
            ? (user.member.permissions as number)
            : (publicPermissions as number)
        : (publicPermissions as number);

    if (!hasPermission(perms, item.requiredPermissions)) {
        return null;
    }

    if (item.type === 'link') {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={
                        item.matchExact
                            ? isCurrentUrl(item.href)
                            : isCurrentOrParentUrl(item.href)
                    }
                    tooltip={{ children: item.title }}
                >
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    } else if (item.type === 'section') {
        const visibleChildren = item.items.filter((child) =>
            hasPermission(perms, child.requiredPermissions),
        );
        if (visibleChildren.length === 0) return null;
        return (
            <SidebarGroup className="px-2 py-0">
                {item.title && (
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                )}
                <SidebarMenu>
                    {visibleChildren.map((child) => (
                        <RenderNavItem key={child.id} item={child} />
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        );
    }
};
