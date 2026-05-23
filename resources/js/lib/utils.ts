import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { App } from '@/wayfinder/types';
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

export function toMemberName(member: App.Models.UnitMember): string {
    if (!member.rank) throw new Error('Member does not have rank info!');
    return `${member.rank.abbreviation} ${member.display_name}`;
}

export function hasPermission(self: number, check: number): boolean {
    const admin =
        (self & UnitPermission.ADMINISTRATOR) === UnitPermission.ADMINISTRATOR;

    const hasPerm = (self & check) === check;

    return admin || hasPerm;
}
