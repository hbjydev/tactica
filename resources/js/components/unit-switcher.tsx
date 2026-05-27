import { ChevronsUpDownIcon, GalleryVerticalEnd } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { dashboard } from '@/wayfinder/routes/unit';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { usePage } from '@inertiajs/react';
import { App } from '@/wayfinder/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export const UnitSwitcher = ({
    current,
    units,
    inSidebar = true,
}: {
    current?: App.Models.Unit;
    units: App.Models.Unit[];
    inSidebar?: boolean;
}) => {
    const {
        props: { auth },
    } = usePage();
    const getInitials = useInitials();

    if (!auth.user) {
        return (
            <div className="flex items-center gap-2 p-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {
                        current?.avatar_url
                            ? <></>
                            : <GalleryVerticalEnd className="size-4" />
                    }
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">
                        {current ? current.display_name : 'Select a unit'}
                    </span>
                </div>
            </div>
        );
    }

    const UsedButton = inSidebar ? SidebarMenuButton : Button;

    const inner = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UsedButton
                    size="lg"
                    variant={inSidebar ? 'default' : 'outline'}
                    className={
                        inSidebar
                            ? 'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            : 'h-12 w-full'
                    }
                >

                    {current
                        ? (
                            <Avatar size="lg">
                                <AvatarImage src={current?.avatar_url as any as string|undefined} alt={current?.display_name ?? 'Unit Avatar'} />
                                <AvatarFallback>
                                    {getInitials(current?.display_name)}
                                </AvatarFallback>
                            </Avatar>
                        )
                        : (
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                        )
                    }

                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-medium">
                            {current ? current.display_name : 'Select a unit'}
                        </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                </UsedButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width)"
                align="start"
            >
                {units.map((unit) => (
                    <DropdownMenuItem
                        key={unit.id}
                        asChild
                        className="flex cursor-pointer items-center justify-between"
                    >
                        <a href={dashboard({ slug: unit.slug }).url}>
                            {unit.display_name}
                            {current && unit.id == current.id && (
                                <Badge variant="outline">Current</Badge>
                            )}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    if (inSidebar) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>{inner}</SidebarMenuItem>
            </SidebarMenu>
        );
    } else return inner;
};
