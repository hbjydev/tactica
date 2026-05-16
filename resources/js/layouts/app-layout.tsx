import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { Unit } from '@/types/units';

export default function AppLayout({
    breadcrumbs = [],
    unit,
    units,
    children,
}: {
    unit: Unit;
    units: Unit[];
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate unit={unit} units={units} breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
