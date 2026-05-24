import { useInitials } from "@/hooks/use-initials";
import { App } from "@/wayfinder/types";
import { Link, usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { show } from "@/wayfinder/routes/unit/structure/sections";
import { show as showMember } from '@/wayfinder/routes/unit/members';
import { AvatarImage, AvatarFallback, Avatar } from "./ui/avatar";
import { Separator } from "./ui/separator";

type Props = {
    sections: App.Models.Section[];
};

export const ORBAT = ({ sections }: Props) => {
    return (
        <div className="flex flex-1 justify-center">
            <div className="tf-tree p-4">
                <ul>
                    {sections.map((section) => (
                        <TreeNode key={section.id} section={section} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

const TreeNode = ({ section }: { section: App.Models.Section }) => {
    const getInitials = useInitials();
    const {
        props: { unit },
    } = usePage();

    return (
        <li>
            <div className="tf-nc">
                <Card className="gap-0! pb-0!">
                    <CardHeader className="mb-6! flex flex-col items-center gap-y-2">
                        <Avatar className="size-16 text-xl">
                            <AvatarImage src={section.avatar_url!} />
                            <AvatarFallback>
                                {getInitials(section.display_name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="underline">
                            <Link
                                href={show({
                                    unit: unit?.slug!,
                                    section: section.id,
                                })}
                            >
                                {section.display_name}
                            </Link>
                        </CardTitle>
                        {section.callsign && (
                            <CardDescription>
                                &quot;{section.callsign.toUpperCase()}&quot;
                            </CardDescription>
                        )}
                        {section.description && (
                            <CardDescription>
                                {section.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    {section.slots && section.slots.length > 0 && (
                        <>
                            <Separator />
                            <CardContent className="px-0!">
                                <table className="w-full text-left">
                                    <tbody>
                                        {section.slots.map((slot) => (
                                            <tr
                                                className="h-8 odd:bg-muted"
                                                key={slot.id}
                                            >
                                                <td className="px-4!">
                                                    {slot.display_name}
                                                </td>
                                                <td className="px-4!">
                                                    {slot.member ? (
                                                        <Link
                                                            href={showMember({
                                                                unit: unit?.slug!,
                                                                member: slot
                                                                    .member
                                                                    ?.id!,
                                                            })}
                                                            className="underline"
                                                        >
                                                            {
                                                                slot.member
                                                                    .formal_name as string
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">
                                                            &mdash;
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
            {section.children && section.children.length > 0 && (
                <ul>
                    {section.children.map((child) => (
                        <TreeNode key={child.id} section={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};
