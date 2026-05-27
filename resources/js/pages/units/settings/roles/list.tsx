import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@/wayfinder/types';
import {
    list,
    store,
    update,
    destroy,
    updatePermissions,
    addBinding,
    removeBinding,
} from '@/wayfinder/routes/unit/roles';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlusIcon, Trash2Icon, ShieldIcon, PencilIcon } from 'lucide-react';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';

// Mirrors App\Models\Enums\UnitPermission
const PERMISSIONS = [
    {
        value: UnitPermission.VIEW_UNIT,
        label: 'View Unit',
        description: 'Can view the unit and its public information.',
    },
    {
        value: UnitPermission.ADMINISTRATOR,
        label: 'Administrator',
        description: 'Full access to all unit features and settings.',
    },
    {
        value: UnitPermission.MANAGE_ROLES,
        label: 'Manage Roles',
        description: 'Can create, edit, and delete roles and assign members.',
    },
    {
        value: UnitPermission.MANAGE_MEMBERS,
        label: 'Manage Members',
        description: 'Can add, remove, and update member profiles.',
    },
    {
        value: UnitPermission.MANAGE_RANKS,
        label: 'Manage Ranks',
        description: 'Can create, edit, and delete ranks.',
    },
    {
        value: UnitPermission.MANAGE_SECTIONS,
        label: 'Manage Sections',
        description:
            'Can create, edit, and delete sections and their associated slots.',
    },
] as const;

type RoleType = 'admin' | 'everyone' | 'members' | 'custom';

const ROLE_TYPE_LABELS: Record<
    RoleType,
    { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
    admin: { label: 'Admin', variant: 'default' },
    members: { label: 'Members', variant: 'secondary' },
    everyone: { label: 'Everyone', variant: 'outline' },
    custom: { label: 'Custom', variant: 'outline' },
};

function roleInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

// Local types that match what the PHP controller actually sends.
interface UserData {
    id: string;
    username: string;
    display_name: string;
}

interface MemberData {
    id: string;
    display_name: string;
    user?: UserData | null;
}

interface RoleData {
    id: string;
    unit_id: string;
    display_name: string;
    description: string | null;
    permissions: number;
    type: RoleType;
    members?: MemberData[];
}

interface UnitData {
    id: string;
    slug: string;
    display_name: string;
}

type Props = Inertia.SharedData & {
    roles: RoleData[];
    members: MemberData[];
};

type Tab = 'permissions' | 'members';

// ─── Create role dialog ──────────────────────────────────────────────────────

function CreateRoleDialog({
    unit,
    onCreated,
}: {
    unit: UnitData;
    onCreated?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    function submit(e: React.FormEvent) {
        e.preventDefault();
        router.post(
            store.url({ unit: unit.slug }),
            { display_name: name, description: description || null },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['roles'],
                onSuccess: () => {
                    setOpen(false);
                    setName('');
                    setDescription('');
                    onCreated?.();
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-full justify-start gap-2 px-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <PlusIcon className="size-3.5" />
                    New role
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create role</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="mt-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-name">Name</Label>
                        <Input
                            id="role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Squad Leader"
                            required
                            autoFocus
                            maxLength={64}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="role-description">
                            Description{' '}
                            <span className="font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            id="role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this role for?"
                            rows={2}
                            maxLength={255}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={!name.trim()}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Rename role dialog ──────────────────────────────────────────────────────

function RenameRoleDialog({ role, unit }: { role: RoleData; unit: UnitData }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(role.display_name);
    const [description, setDescription] = useState(role.description ?? '');

    function submit(e: React.FormEvent) {
        e.preventDefault();
        router.patch(
            update.url({ unit: unit.slug, role: role.id }),
            { display_name: name, description: description || null },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['roles'],
                onSuccess: () => setOpen(false),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                >
                    <PencilIcon className="size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit role</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="mt-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rename-name">Name</Label>
                        <Input
                            id="rename-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            maxLength={64}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="rename-description">
                            Description{' '}
                            <span className="font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            id="rename-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            maxLength={255}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={!name.trim()}>
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Permissions tab ────────────────────────────────────────────────────────

function PermissionsTab({
    role,
    unit,
    editable,
}: {
    role: RoleData;
    unit: UnitData;
    editable: boolean;
}) {
    const [perms, setPerms] = useState(role.permissions);
    const [dirty, setDirty] = useState(false);

    function toggle(value: number) {
        setPerms((prev) => {
            const next = prev & value ? prev & ~value : prev | value;
            setDirty(next !== role.permissions);
            return next;
        });
    }

    function save() {
        router.patch(
            updatePermissions.url({ unit: unit.slug, role: role.id }),
            { permissions: perms },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['roles'],
                onSuccess: () => setDirty(false),
            },
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <p className="text-sm text-muted-foreground">
                    Toggle which permissions members with this role inherit.
                    Permissions stack across all assigned roles.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {PERMISSIONS.map((perm) => {
                    const checked = Boolean(perms & perm.value);
                    return (
                        <div
                            key={perm.value}
                            className="flex items-start gap-3"
                        >
                            <Checkbox
                                id={`perm-${perm.value}`}
                                checked={checked}
                                disabled={!editable}
                                onCheckedChange={() => toggle(perm.value)}
                                className="mt-0.5"
                            />
                            <div className="flex flex-col gap-0.5">
                                <Label
                                    htmlFor={`perm-${perm.value}`}
                                    className="cursor-pointer font-medium"
                                >
                                    {perm.label}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    {perm.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {editable && (
                <div className="flex">
                    <Button size="sm" disabled={!dirty} onClick={save}>
                        Save permissions
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Members tab ────────────────────────────────────────────────────────────

function AddMemberDialog({
    role,
    unit,
    allMembers,
    assignedIds,
}: {
    role: RoleData;
    unit: UnitData;
    allMembers: MemberData[];
    assignedIds: Set<string>;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const available = allMembers.filter(
        (m) =>
            !assignedIds.has(m.id) &&
            (m.display_name.toLowerCase().includes(query.toLowerCase()) ||
                m.user?.display_name
                    .toLowerCase()
                    .includes(query.toLowerCase())),
    );

    function add(memberId: string) {
        router.post(
            addBinding.url({ unit: unit.slug, role: role.id }),
            { member_id: memberId },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['roles'],
                onSuccess: () => setOpen(false),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PlusIcon />
                    Add member
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add member to {role.display_name}</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Search members..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="mt-2"
                    autoFocus
                />
                <div className="mt-2 flex max-h-72 flex-col gap-1 overflow-y-auto">
                    {available.length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No members to add.
                        </p>
                    )}
                    {available.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                            onClick={() => add(m.id)}
                        >
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs">
                                    {roleInitials(m.display_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {m.display_name}
                                </p>
                                {m.user && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        @{m.user.username}
                                    </p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MembersTab({
    role,
    unit,
    allMembers,
    editable,
}: {
    role: RoleData;
    unit: UnitData;
    allMembers: MemberData[];
    editable: boolean;
}) {
    const assignedMembers = role.members ?? [];
    const assignedIds = new Set(assignedMembers.map((m) => m.id));

    function remove(memberId: string) {
        router.delete(
            removeBinding.url({
                unit: unit.slug,
                role: role.id,
                member: memberId,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                only: ['roles'],
            },
        );
    }

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {assignedMembers.length}{' '}
                    {assignedMembers.length === 1 ? 'member' : 'members'} with
                    this role.
                </p>
                {editable && (
                    <AddMemberDialog
                        role={role}
                        unit={unit}
                        allMembers={allMembers}
                        assignedIds={assignedIds}
                    />
                )}
            </div>

            <div className="flex flex-col gap-1">
                {role.type === 'everyone' && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        This role applies to every member of your unit
                        automatically, you cannot assign members to it directly.
                    </p>
                )}
                {role.type !== 'everyone' && assignedMembers.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No members with this role yet.
                    </p>
                )}
                {assignedMembers.map((m) => (
                    <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-md px-2 py-2"
                    >
                        <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                                {roleInitials(m.display_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {m.display_name}
                            </p>
                            {m.user && (
                                <p className="truncate text-xs text-muted-foreground">
                                    @{m.user.username}
                                </p>
                            )}
                        </div>
                        {editable && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(m.id)}
                            >
                                <Trash2Icon className="size-3.5" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const RolesList = ({ roles, members, unit }: Props) => {
    const [selectedId, setSelectedId] = useState<string | null>(
        roles[0]?.id ?? null,
    );
    const [activeTab, setActiveTab] = useState<Tab>('permissions');

    const selected = roles.find((r) => r.id === selectedId) ?? null;
    const unitData = unit as UnitData;

    function deleteRole(role: RoleData) {
        router.delete(destroy.url({ unit: unitData.slug, role: role.id }), {
            preserveScroll: true,
            preserveState: false, // let state reset so we land on the next role
            only: ['roles'],
            onSuccess: () =>
                setSelectedId(roles.find((r) => r.id !== role.id)?.id ?? null),
        });
    }

    return (
        <div className="flex h-full min-h-0 overflow-hidden">
            {/* Left sidebar — role list */}
            <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r bg-sidebar">
                <div className="p-3">
                    <p className="px-2 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Roles
                    </p>
                    <div className="flex flex-col gap-0.5">
                        {roles.map((role) => {
                            const isActive = role.id === selectedId;
                            const typeInfo =
                                ROLE_TYPE_LABELS[role.type] ??
                                ROLE_TYPE_LABELS.custom;
                            return (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(role.id);
                                        setActiveTab('permissions');
                                    }}
                                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                                        isActive
                                            ? 'bg-accent font-medium text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                                    }`}
                                >
                                    <ShieldIcon className="size-3.5 shrink-0" />
                                    <span className="flex-1 truncate">
                                        {role.display_name}
                                    </span>
                                    {role.type !== 'custom' && (
                                        <Badge
                                            variant={typeInfo.variant}
                                            className="h-4 px-1 text-[10px]"
                                        >
                                            {typeInfo.label}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}

                        <Separator className="my-1" />

                        <CreateRoleDialog unit={unitData} />
                    </div>
                </div>
            </aside>

            {/* Right panel */}
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                {selected === null ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                        Select a role to get started.
                    </div>
                ) : (
                    <>
                        {/* Role header */}
                        <div className="border-b px-6 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-lg leading-none font-semibold">
                                        {selected.display_name}
                                    </h2>
                                    {selected.description && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {selected.description}
                                        </p>
                                    )}
                                </div>

                                {/* Actions — only for editable (non-admin) roles */}
                                {selected.type !== 'admin' && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <RenameRoleDialog
                                            key={selected.id}
                                            role={selected}
                                            unit={unitData}
                                        />

                                        {selected.type === 'custom' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2Icon className="size-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete{' '}
                                                            {
                                                                selected.display_name
                                                            }
                                                            ?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will
                                                            permanently delete
                                                            the role and remove
                                                            it from all members.
                                                            This cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                deleteRole(
                                                                    selected,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tab bar */}
                            <div className="mt-4 flex gap-1">
                                {(['permissions', 'members'] as Tab[]).map(
                                    (tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                                                activeTab === tab
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Tab content */}
                        {activeTab === 'permissions' && (
                            <PermissionsTab
                                key={selected.id}
                                role={selected}
                                unit={unitData}
                                editable={selected.type !== 'admin'}
                            />
                        )}
                        {activeTab === 'members' && (
                            <MembersTab
                                key={selected.id}
                                role={selected}
                                unit={unitData}
                                allMembers={members}
                                editable={
                                    selected.type !== 'admin' &&
                                    selected.type !== 'everyone'
                                }
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

RolesList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Roles',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default RolesList;
