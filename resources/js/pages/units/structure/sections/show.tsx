import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import {
    destroy,
    edit,
    list,
    show,
} from '@/wayfinder/routes/unit/structure/sections';
import { Link, router } from '@inertiajs/react';
import { App, Inertia } from '@/wayfinder/types';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { slotColumns } from '@/components/views/sections/columns';
import { memberColumns } from '@/components/views/members/columns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { SlotModal } from '@/components/views/sections/slot-modal';
import { ORBAT } from '@/components/orbat';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import moment from 'moment';

type Props = Inertia.Pages.Units.Structure.Sections.Show;

const SectionShow = ({ section, unit }: Props) => {
    const getInitials = useInitials();

    return (
        <div className="flex flex-col gap-y-4 p-4">
            <Card>
                <CardContent className="flex flex-col items-center gap-4 md:flex-row">
                    <Avatar size="huge">
                        <AvatarImage
                            src={section.avatar_url as any as string}
                            alt={`${section.display_name} avatar`}
                        />
                        <AvatarFallback>
                            {getInitials(section.display_name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-1 items-center justify-between xl:col-span-7">
                        <div className="flex flex-col gap-y-2">
                            <Heading
                                title={`${section.display_name}`}
                                description={
                                    section.description ||
                                    'No description provided.'
                                }
                                className="!mb-0"
                            />

                            {section.callsign && <span>Callsign: {section.callsign}</span>}

                            <span className="text-muted-foreground">Created at: {moment(section.created_at).local().format('DD/MM/YYYY')}</span>
                        </div>

                        <AuthGuard permission={UnitPermission.MANAGE_SECTIONS}>
                            <div className="flex items-center gap-x-2">
                                <Button size="icon-lg" asChild>
                                    {/* oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain */}
                                    <Link
                                        href={edit({
                                            unit: unit?.slug!,
                                            section: section.id,
                                        })}
                                    >
                                        <PencilIcon />
                                    </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon-lg"
                                            variant="destructive"
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete {section.display_name}?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete{' '}
                                                {section.display_name} and
                                                unassign all members in this
                                                section. This action cannot be
                                                undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() =>
                                                    router.delete(
                                                        destroy.url({
                                                            // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                                                            unit: unit?.slug!,
                                                            section: section.id,
                                                        }),
                                                    )
                                                }
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete section
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </AuthGuard>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Slots</CardTitle>
                            <CardDescription>
                                Organize your members into slots within the
                                section.
                            </CardDescription>
                            <CardAction>
                                <SlotModal section={section} />
                            </CardAction>
                        </CardHeader>

                        <CardContent>
                            {
                                section.slots && section.slots.length > 0
                                    ? (
                                        <DataTable
                                        columns={slotColumns(section)}
                                        data={section.slots}
                                        />
                                    )
                                    : (
                                        <Empty className="border">
                                            <EmptyHeader>
                                                <EmptyTitle>No slots</EmptyTitle>
                                                <EmptyDescription>
                                                    No slots have been created for
                                                    this section yet.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )
                            }
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>See all of the members within the section</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {
                                section.members && section.members.length > 0
                                    ? (
                                        <DataTable
                                            columns={memberColumns}
                                            data={section.members.map(member => ({
                                                ...member,
                                                unit: { slug: unit?.slug },
                                            } as App.Models.UnitMember))}
                                        />
                                    )
                                    : (
                                        <Empty className="border">
                                            <EmptyHeader>
                                                <EmptyTitle>No members</EmptyTitle>
                                                <EmptyDescription>
                                                    This section has no members assigned to it yet.
                                                </EmptyDescription>
                                            </EmptyHeader>
                                        </Empty>
                                    )
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ORBAT</CardTitle>
                </CardHeader>

                <CardContent>
                    <ORBAT sections={[section]} />
                </CardContent>
            </Card>
        </div>
    );
};

SectionShow.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'Sections',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: props.section.display_name,
                href: show({
                    // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                    unit: props.unit?.slug!,
                    section: props.section.id,
                }),
            },
        ],
    },
];

export default SectionShow;
