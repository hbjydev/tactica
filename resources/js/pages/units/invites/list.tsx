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
} from '@/components/ui/alert-dialog';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { InviteAnalyticsSheet } from '@/components/views/invites/analytics-sheet';
import { createInviteColumns } from '@/components/views/invites/columns';
import { InviteFormDialog } from '@/components/views/invites/invite-form-dialog';
import AppLayout from '@/layouts/app-layout';
import { destroy, list } from '@/wayfinder/routes/unit/invites';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { App, Inertia } from '@/wayfinder/types';
import { router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
    invites: App.Models.UnitInvite[];
    ranks: App.Models.Rank[];
    roles: App.Models.UnitRole[];
} & Inertia.SharedData;

const InvitesList = ({ auth, unit, invites, ranks, roles }: Props) => {
    const [createOpen, setCreateOpen] = useState(false);
    const [editInvite, setEditInvite] = useState<App.Models.UnitInvite | null>(
        null,
    );
    const [analyticsInvite, setAnalyticsInvite] =
        useState<App.Models.UnitInvite | null>(null);
    const [deleteInvite, setDeleteInvite] =
        useState<App.Models.UnitInvite | null>(null);

    const columns = useMemo(
        () =>
            createInviteColumns({
                unit: unit!,
                auth,
                onEdit: (invite) => setEditInvite(invite),
                onViewAnalytics: (invite) => setAnalyticsInvite(invite),
                onDelete: (invite) => setDeleteInvite(invite),
            }),
        [unit, auth],
    );

    const confirmDelete = () => {
        if (!deleteInvite) return;
        router.delete(
            destroy.url({ unit: unit!.slug, invite: deleteInvite.id }),
            {
                preserveScroll: true,
                onFinish: () => setDeleteInvite(null),
            },
        );
    };

    return (
        <div className="flex flex-col p-4">
            <div className="mb-8 flex items-center justify-between">
                <Heading
                    title="Invites"
                    description="Generate invite links to bring new members into the unit. Links can be capped, time-limited, and revoked at any time."
                    className="mb-0! max-w-3xl!"
                />

                <AuthGuard permission={UnitPermission.MANAGE_INVITES}>
                    <Button
                        variant="outline"
                        onClick={() => setCreateOpen(true)}
                    >
                        <PlusIcon />
                        Create invite
                    </Button>
                </AuthGuard>
            </div>

            <DataTable columns={columns} data={invites} />

            <InviteFormDialog
                unit={unit!}
                ranks={ranks}
                roles={roles}
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <InviteFormDialog
                unit={unit!}
                ranks={ranks}
                roles={roles}
                invite={editInvite}
                open={editInvite !== null}
                onOpenChange={(o) => !o && setEditInvite(null)}
            />

            <InviteAnalyticsSheet
                unit={unit!}
                invite={analyticsInvite}
                open={analyticsInvite !== null}
                onOpenChange={(o) => !o && setAnalyticsInvite(null)}
            />

            <AlertDialog
                open={deleteInvite !== null}
                onOpenChange={(o) => !o && setDeleteInvite(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete invite?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently deletes the invite link and its
                            analytics. Anyone who hasn't accepted yet won't be
                            able to use the link. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

InvitesList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Invites',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default InvitesList;
