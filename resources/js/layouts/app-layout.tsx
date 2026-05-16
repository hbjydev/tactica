import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { Unit } from '@/types/units';

export default function AppLayout({
    breadcrumbs = [],
    unit,
    auth,
    children,
}: {
    unit: Unit;
    auth: {
        units: Unit[];
    };
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate unit={unit} units={auth.units} breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
