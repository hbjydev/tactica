import { Link, router } from '@inertiajs/react';
import { LogOut, User2Icon, UserCogIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { show as memberProfile } from '@/routes/unit/members';
import { edit as ssoSettings } from '@/routes/sso/profile';
import type { User } from '@/types';
import { Unit, UnitMember } from '@/types/units';

type Props = {
    user: User;
    unit: Unit;
    member?: UnitMember;
};

export function UserMenuContent({ user, unit, member }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} member={member} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {member && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full cursor-pointer"
                            href={memberProfile({ unit: unit.slug, member: member.id })}
                            onClick={cleanup}
                        >
                            <User2Icon className="mr-2" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                    <a
                        className="block w-full cursor-pointer"
                        href={ssoSettings().url}
                        onClick={cleanup}
                    >
                        <UserCogIcon className="mr-2" />
                        Manage Account
                    </a>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
