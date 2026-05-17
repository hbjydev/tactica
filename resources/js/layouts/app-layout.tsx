import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { Unit, UnitMember } from '@/types/units';

export default function AppLayout({
    breadcrumbs = [],
    unit,
    member,
    auth,
    children,
}: {
    unit: Unit;
    member?: UnitMember;
    auth: {
        units: Unit[];
    };
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate
            unit={unit}
            units={auth.units}
            member={member}
            breadcrumbs={breadcrumbs}
        >
            {children}
        </AppLayoutTemplate>
    );
}
