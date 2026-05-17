import { UnitMember } from '@/types/units';
import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function toMemberName(member: UnitMember): string {
    if (!member.rank) throw new Error('Member does not have rank info!');
    return `${member.rank.abbreviation} ${member.display_name}`;
}
