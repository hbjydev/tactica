import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { App } from '@/wayfinder/types';

export function UserInfo({
    user,
    member,
}: {
    user: App.Models.User;
    member: App.Models.UnitMember | null;
}) {
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
                {member && (
                    <span className="truncate">
                        <span className="font-semibold">
                            {member.rank?.abbreviation}&nbsp;
                        </span>
                        {member.display_name}
                    </span>
                )}
                <span className="truncate text-muted-foreground">
                    @{user.username}
                </span>
            </div>
        </>
    );
}
