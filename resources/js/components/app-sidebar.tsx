import { LayoutGrid, Medal, Shield, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/wayfinder/routes/unit';
import { list as listRanks } from '@/wayfinder/routes/unit/ranks';
import { list as listMembers } from '@/wayfinder/routes/unit/members';
import { list as listRoles } from '@/wayfinder/routes/unit/roles';
import type { NavItem } from '@/types';
import { UnitSwitcher } from './unit-switcher';
import { App } from '@/wayfinder/types';

export function AppSidebar({
    currentUnit,
    units,
    member,
}: {
    currentUnit: App.Models.Unit;
    units: App.Models.Unit[];
    member: App.Models.UnitMember | null;
}) {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard({ unit: currentUnit.slug }),
            icon: LayoutGrid,
            matchExact: true,
        },

        {
            title: 'Ranks',
            href: listRanks({ unit: currentUnit.slug }),
            icon: Medal,
        },

        {
            title: 'Roles',
            href: listRoles({ unit: currentUnit.slug }),
            icon: Shield,
        },

        {
            title: 'Personnel',
            href: listMembers({ unit: currentUnit.slug }),
            icon: Users,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <UnitSwitcher current={currentUnit} units={units} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser member={member} unit={currentUnit} />
            </SidebarFooter>
        </Sidebar>
    );
}
