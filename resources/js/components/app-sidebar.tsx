import { LayoutGrid } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { Unit } from '@/types/units';
import { UnitSwitcher } from './unit-switcher';

export function AppSidebar({ currentUnit, units }: { currentUnit: Unit; units: Unit[] }) {
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard({ unit: currentUnit.slug }),
            icon: LayoutGrid,
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
