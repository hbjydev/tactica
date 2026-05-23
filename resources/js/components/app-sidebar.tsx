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
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';

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
            id: 'home',
            type: 'section',
            requiredPermissions: UnitPermission.VIEW_UNIT,
            items: [
                {
                    id: 'dashboard',
                    type: 'link',
                    title: 'Dashboard',
                    href: dashboard({ unit: currentUnit.slug }),
                    icon: LayoutGrid,
                    matchExact: true,
                    requiredPermissions: UnitPermission.VIEW_UNIT,
                },
            ],
        },

        {
            id: 'personnel',
            type: 'section',
            title: 'Personnel',
            requiredPermissions: UnitPermission.VIEW_UNIT,
            items: [
                {
                    id: 'members',
                    type: 'link',
                    title: 'Members',
                    href: listMembers({ unit: currentUnit.slug }),
                    icon: Users,
                    requiredPermissions: UnitPermission.VIEW_UNIT,
                },
                {
                    id: 'ranks',
                    type: 'link',
                    title: 'Ranks',
                    href: listRanks({ unit: currentUnit.slug }),
                    icon: Medal,
                    requiredPermissions: UnitPermission.VIEW_UNIT,
                },
            ],
        },

        {
            id: 'settings',
            type: 'section',
            title: 'Unit Settings',
            requiredPermissions: UnitPermission.MANAGE_ROLES,
            items: [
                {
                    id: 'roles',
                    type: 'link',
                    title: 'Roles',
                    href: listRoles({ unit: currentUnit.slug }),
                    icon: Shield,
                    requiredPermissions: UnitPermission.MANAGE_ROLES,
                },
            ],
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
