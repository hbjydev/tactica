import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    id: string;
    requiredPermissions: number;
} & (
    | {
          type: 'link';
          title: string;
          href: NonNullable<InertiaLinkProps['href']>;
          matchExact?: boolean;
          icon?: LucideIcon | null;
          isActive?: boolean;
      }
    | {
          type: 'section';
          title?: string;
          items: NavItem[];
      }
);
