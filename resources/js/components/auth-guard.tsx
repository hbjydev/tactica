import { hasPermission } from '@/lib/utils';
import { useAuth } from '@/state/auth';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

export const AuthGuard = ({
    children,
    permission,
    bypass = false,
}: {
    children: ReactNode;
    permission: number;
    bypass?: boolean;
}) => {
    const { publicPermissions } = usePage().props;
    const { user } = useAuth();

    const isAuthed = user !== null;
    const isMember = isAuthed ? user.member !== null : false;

    const perms = isMember
        ? (user?.member?.permissions as number)
        : (publicPermissions as number);

    if (bypass || hasPermission(perms, permission)) {
        return <>{children}</>;
    }

    return null;
};
