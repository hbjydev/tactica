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
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { toMemberName } from '@/lib/utils';
import { destroy, edit, list, show } from '@/wayfinder/routes/unit/structure/sections';
import { Link, router } from '@inertiajs/react';
import { App, Inertia } from '@/wayfinder/types';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { slotColumns } from '@/components/views/sections/columns';
import { memberColumns } from '@/components/views/members/columns';

type Props = Inertia.Pages.Units.Structure.Sections.Show;

const SectionShow = ({ section, unit }: Props) => {
    return (
        <div className="flex flex-col p-4 gap-y-4">
            <div className="flex items-center justify-between xl:col-span-7">
                <Heading
                    title={`${section.display_name}`}
                    description={section.description || 'No description provided.'}
                    className="!mb-0"
                />

                <AuthGuard permission={UnitPermission.MANAGE_SECTIONS}>
                    <div className="flex items-center gap-x-2">
                        <Button size="icon" asChild>
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
                                <Button size="icon" variant="destructive">
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
                                        {section.display_name} and unassign all
                                        members in this section. This action
                                        cannot be undone.
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

            <div className="grid lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Slots</CardTitle>
                            <CardDescription>Organize your members into slots within the section.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            {(section.slots && section.slots.length > 0) && (
                                <DataTable columns={slotColumns} data={section.slots} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                        </CardHeader>

                        <CardContent>
                            {(section.members && section.members.length > 0) && (
                                <DataTable
                                    columns={memberColumns}
                                    data={
                                        section.members.map(member => ({
                                            ...member,
                                            unit: { slug: unit?.slug! }
                                        } as App.Models.UnitMember))
                                    } />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
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
