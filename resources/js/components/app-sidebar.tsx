import { Grid, LayoutGrid, Mail, Medal, Shield, Users, Users2 } from 'lucide-react';
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
import { list as listInvites } from '@/wayfinder/routes/unit/invites';
import { list as listSections } from '@/wayfinder/routes/unit/structure/sections';
import type { NavItem } from '@/types';
import { UnitSwitcher } from './unit-switcher';
import { App } from '@/wayfinder/types';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { orbat } from '@/wayfinder/routes/unit/structure';

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
            id: 'structure',
            type: 'section',
            title: 'Structure',
            requiredPermissions: UnitPermission.VIEW_UNIT,
            items: [
                {
                    id: 'orbat',
                    type: 'link',
                    title: 'ORBAT',
                    href: orbat({ unit: currentUnit.slug }),
                    icon: Grid,
                    requiredPermissions: UnitPermission.VIEW_UNIT,
                },
                {
                    id: 'sections',
                    type: 'link',
                    title: 'Sections',
                    href: listSections({ unit: currentUnit.slug }),
                    icon: Users2,
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
            // Gate the section on `0` so any visible child surfaces it.
            // Per-item gates below handle the real authorization.
            requiredPermissions: 0,
            items: [
                {
                    id: 'roles',
                    type: 'link',
                    title: 'Roles',
                    href: listRoles({ unit: currentUnit.slug }),
                    icon: Shield,
                    requiredPermissions: UnitPermission.MANAGE_ROLES,
                },
                {
                    id: 'invites',
                    type: 'link',
                    title: 'Invites',
                    href: listInvites({ unit: currentUnit.slug }),
                    icon: Mail,
                    requiredPermissions: UnitPermission.MANAGE_INVITES,
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
                <NavUser unit={currentUnit} />
            </SidebarFooter>
        </Sidebar>
    );
}
