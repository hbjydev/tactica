import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { hasPermission } from '@/lib/utils';
import { revoke } from '@/wayfinder/routes/unit/invites';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { App, Inertia } from '@/wayfinder/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ChartColumnIcon,
    CopyIcon,
    PencilIcon,
    TrashIcon,
    XCircleIcon,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

type Props = {
    unit: App.Models.Unit;
    auth: Inertia.SharedData['auth'];
    onEdit: (invite: App.Models.UnitInvite) => void;
    onViewAnalytics: (invite: App.Models.UnitInvite) => void;
    onDelete: (invite: App.Models.UnitInvite) => void;
};

const STATUS_VARIANT: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    active: 'default',
    expired: 'outline',
    revoked: 'destructive',
    exhausted: 'secondary',
};

export const createInviteColumns = ({
    unit,
    auth,
    onEdit,
    onViewAnalytics,
    onDelete,
}: Props): ColumnDef<App.Models.UnitInvite>[] => {
    const canManage =
        auth.user?.member &&
        hasPermission(
            auth.user.member.permissions as number,
            UnitPermission.MANAGE_INVITES,
        );

    const copyLink = async (invite: App.Models.UnitInvite) => {
        try {
            await navigator.clipboard.writeText(invite.accept_url);
            toast.success('Invite link copied to clipboard.');
        } catch {
            toast.error('Failed to copy invite link.');
        }
    };

    const revokeInvite = (invite: App.Models.UnitInvite) => {
        router.post(
            revoke.url({ unit: unit.slug, invite: invite.id }),
            {},
            { preserveScroll: true },
        );
    };

    const columns: ColumnDef<App.Models.UnitInvite>[] = [
        {
            accessorKey: 'notes',
            header: 'Notes',
            cell: ({ row }) =>
                row.original.notes || (
                    <span className="text-muted-foreground">&mdash;</span>
                ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge
                        variant={STATUS_VARIANT[status] ?? 'outline'}
                        className="capitalize"
                    >
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'usage',
            header: 'Uses',
            cell: ({ row }) => {
                const { uses, max_uses } = row.original;
                return (
                    <span>
                        {uses} / {max_uses ?? '∞'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'views',
            header: 'Views',
        },
        {
            id: 'conversion',
            header: 'Conversion',
            cell: ({ row }) => {
                const { uses, views } = row.original;
                if (views === 0) {
                    return (
                        <span className="text-muted-foreground">&mdash;</span>
                    );
                }
                const pct = Math.round((uses / views) * 100);
                return <span>{pct}%</span>;
            },
        },
        {
            accessorKey: 'expires_at',
            header: 'Expires',
            cell: ({ row }) => {
                const v = row.original.expires_at;
                if (!v)
                    return <span className="text-muted-foreground">Never</span>;
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>{moment(v).fromNow()}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {moment(v).format('LLL')}
                        </TooltipContent>
                    </Tooltip>
                );
            },
        },
        {
            id: 'default_rank',
            header: 'Default Rank',
            cell: ({ row }) =>
                row.original.default_rank?.display_name ?? (
                    <span className="text-muted-foreground">Entry rank</span>
                ),
        },
        {
            id: 'default_roles',
            header: 'Roles',
            cell: ({ row }) => {
                const roles = row.original.default_roles ?? [];
                if (roles.length === 0)
                    return (
                        <span className="text-muted-foreground">&mdash;</span>
                    );
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.map((r) => (
                            <Badge key={r.id} variant="secondary">
                                {r.display_name}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            id: 'creator',
            header: 'Created by',
            cell: ({ row }) =>
                row.original.created_by_member?.display_name ?? (
                    <span className="text-muted-foreground">&mdash;</span>
                ),
        },
    ];

    if (canManage) {
        columns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const invite = row.original;
                const isActive = invite.status === 'active';
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyLink(invite)}
                            title="Copy invite link"
                        >
                            <CopyIcon />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onViewAnalytics(invite)}
                            title="View analytics"
                        >
                            <ChartColumnIcon />
                        </Button>

                        {isActive && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onEdit(invite)}
                                title="Edit invite"
                            >
                                <PencilIcon />
                            </Button>
                        )}

                        {isActive && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => revokeInvite(invite)}
                                title="Revoke invite"
                            >
                                <XCircleIcon />
                            </Button>
                        )}

                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => onDelete(invite)}
                            title="Delete invite"
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                );
            },
        });
    }

    return columns;
};
