import { ChevronsUpDownIcon, GalleryVerticalEnd } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Unit } from "@/types/units";
import { dashboard } from "@/routes/unit";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const UnitSwitcher = ({
    current,
    units,
    inSidebar = true,
}: {
    current?: Unit;
    units: Unit[];
    inSidebar?: boolean;
}) => {
    const UsedButton = inSidebar ? SidebarMenuButton : Button;

    const inner = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UsedButton
                    size="lg"
                    variant={inSidebar ? 'default' : 'outline'}
                    className={inSidebar ? "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" : 'w-full h-12'}
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
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
                        className="cursor-pointer flex items-center justify-between"
                    >
                        <a
                            href={dashboard({ slug: unit.slug }).url}
                        >
                            {unit.display_name}
                            {(current && unit.id == current.id) && <Badge variant="outline">Current</Badge>}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    if (inSidebar) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    {inner}
                </SidebarMenuItem>
            </SidebarMenu>
        );
    } else return inner;
};
