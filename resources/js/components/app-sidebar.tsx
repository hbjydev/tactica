import { LayoutGrid, Medal, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/unit';
import { list as listRanks } from '@/routes/unit/ranks';
import { list as listMembers } from '@/routes/unit/members';
import type { NavItem } from '@/types';
import { Unit, UnitMember } from '@/types/units';
import { UnitSwitcher } from './unit-switcher';

export function AppSidebar({
    currentUnit,
    units,
    member,
}: {
    currentUnit: Unit;
    units: Unit[];
    member?: UnitMember;
}) {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard({ unit: currentUnit.slug }),
            icon: LayoutGrid,
        },

        {
            title: 'Ranks',
            href: listRanks({ unit: currentUnit.slug }),
            icon: Medal,
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
                <NavUser member={member} />
            </SidebarFooter>
        </Sidebar>
    );
}
