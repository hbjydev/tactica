import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';
import { App, Inertia } from '@/wayfinder/types';

export type AppLayoutProps = {
    unit: App.Models.Unit;
    auth: Inertia.SharedData['auth'];
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
