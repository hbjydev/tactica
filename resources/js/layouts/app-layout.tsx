import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { App, Inertia } from '@/wayfinder/types';

export default function AppLayout({
    breadcrumbs = [],
    unit,
    auth,
    children,
}: {
    unit: App.Models.Unit;
    auth: Inertia.SharedData['auth'];
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate unit={unit} auth={auth} breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
