import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';
import { Unit } from './units';

export type AppLayoutProps = {
    unit: Unit;
    units: Unit[];
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
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
