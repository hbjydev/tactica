import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { App } from '@/wayfinder/types';

export function UserInfo({ user }: { user: App.Models.User }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={'#'} alt={user.display_name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.display_name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                {user.member && (
                    <span className="truncate">
                        <span className="font-semibold">
                            {user.member.formal_name as string}
                        </span>
                    </span>
                )}
                <span className="truncate text-muted-foreground">
                    @{user.username}
                </span>
            </div>
        </>
    );
}
