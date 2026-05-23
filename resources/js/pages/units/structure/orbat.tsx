import Heading from "@/components/heading";
import AppLayout from "@/layouts/app-layout";
import { orbat } from "@/wayfinder/routes/unit/structure";
import { App, Inertia } from "@/wayfinder/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useInitials } from "@/hooks/use-initials";
import { Separator } from "@/components/ui/separator";
import { show } from "@/wayfinder/routes/unit/structure/sections";
import { show as showMember } from "@/wayfinder/routes/unit/members";
import { Link, usePage } from "@inertiajs/react";

type Props = Inertia.Pages.Units.Structure.Orbat;

const ORBAT = ({ sections }: Props) => {
    return (
        <>
            <div className="flex flex-col p-4">
                <Heading
                    title="ORBAT"
                    description="The ORBAT (Order of Battle) provides a hierarchical view of your unit's structure, allowing you to visualize the relationships between sections and their sub-sections."
                />
            </div>
            <div className="flex flex-1 p-4 justify-center">
                <div className="tf-tree">
                    <ul>
                        {sections.map((section) => (
                            <TreeNode key={section.id} section={section} />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

const TreeNode = ({ section }: { section: App.Models.Section }) => {
    // const getInitials = useInitials();
    const { props: { unit } } = usePage();

    return (
        <li>
            <div className="tf-nc">
                <Card className="gap-0! pb-0!">
                    <CardHeader className="flex flex-col items-center gap-y-2 mb-6!">
                        {/* {section.avatar_url && ( */}
                        {/*     <Avatar className="size-16 text-xl"> */}
                        {/*         <AvatarImage src="#" /> */}
                        {/*         <AvatarFallback>{getInitials(section.display_name)}</AvatarFallback> */}
                        {/*     </Avatar> */}
                        {/* )} */}
                        <CardTitle className="underline">
                            <Link href={show({ unit: unit?.slug!, section: section.id })}>
                                {section.display_name}
                            </Link>
                        </CardTitle>
                        {section.callsign && <CardDescription>&quot;{section.callsign.toUpperCase()}&quot;</CardDescription>}
                        {section.description && <CardDescription>{section.description}</CardDescription>}
                    </CardHeader>
                    {(section.slots && section.slots.length > 0) && (
                        <>
                            <Separator />
                            <CardContent className="px-0!">
                                <table className="w-full text-left">
                                    {section.slots.map(slot => (
                                        <tr className="odd:bg-muted h-8">
                                            <td className="px-4!">{slot.display_name}</td>
                                            <td className="px-4!">
                                                {slot.member
                                                    ? (
                                                        <Link
                                                            href={showMember({ unit: unit?.slug!, member: slot.member?.id! })}
                                                            className="underline"
                                                        >
                                                            {slot.member.formal_name as string}
                                                        </Link>
                                                    )
                                                    : (
                                                        <span className="italic text-muted-foreground">
                                                            &mdash;
                                                        </span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </table>
                            </CardContent>
                        </>
                    )}
                </Card>
            </div>
            {(section.children && section.children.length > 0) && (
                <ul>
                    {section.children.map((child) => <TreeNode key={child.id} section={child} />)}
                </ul>
            )}
        </li>
    )
};

ORBAT.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'ORBAT',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: orbat({ unit: props.unit?.slug! }),
            },
        ],
    }
];

export default ORBAT;
