import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import InvitesController from '@/wayfinder/App/Http/Controllers/Units/InvitesController';
import { App } from '@/wayfinder/types';
import { useForm } from '@inertiajs/react';
import moment from 'moment';
import { FormEvent, useEffect, useMemo } from 'react';

type Props = {
    unit: App.Models.Unit;
    ranks: App.Models.Rank[];
    roles: App.Models.UnitRole[];
    userlessMembers?: App.Models.UnitMember[];
    invite?: App.Models.UnitInvite | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DEFAULT_EXPIRES_DAYS = 7;
const NO_RANK = '__none__';
const NO_MEMBER = '__none__';

const toLocalInput = (iso: string | null | undefined): string => {
    if (!iso) return '';
    return moment(iso).format('YYYY-MM-DDTHH:mm');
};

const fromLocalInput = (v: string): string | null => {
    if (!v) return null;
    return moment(v).toISOString();
};

export const InviteFormDialog = ({
    unit,
    ranks,
    roles,
    userlessMembers,
    invite,
    open,
    onOpenChange,
}: Props) => {
    const defaultExpires = useMemo(
        () =>
            moment()
                .add(DEFAULT_EXPIRES_DAYS, 'days')
                .format('YYYY-MM-DDTHH:mm'),
        [],
    );

    const defaultRankId = useMemo(() => {
        if (invite) return invite.default_rank_id ?? NO_RANK;
        const lowest = [...ranks].sort((a, b) => a.ord - b.ord)[0];
        return lowest?.id ?? NO_RANK;
    }, [invite, ranks]);

    const { data, setData, post, patch, processing, errors, reset, transform } =
        useForm({
            notes: invite?.notes ?? '',
            expires_at: invite
                ? toLocalInput(invite.expires_at)
                : defaultExpires,
            max_uses: invite?.max_uses?.toString() ?? '',
            default_rank_id: defaultRankId,
            default_role_ids: (invite?.default_roles ?? []).map((r) => r.id),
            member_id: '',
        });

    useEffect(() => {
        if (!open) return;
        setData({
            notes: invite?.notes ?? '',
            expires_at: invite
                ? toLocalInput(invite.expires_at)
                : defaultExpires,
            max_uses: invite?.max_uses?.toString() ?? '',
            default_rank_id: defaultRankId,
            default_role_ids: (invite?.default_roles ?? []).map((r) => r.id),
            member_id: '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, invite]);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        transform((current) => ({
            ...current,
            expires_at: fromLocalInput(current.expires_at) ?? '',
            max_uses:
                current.max_uses === ''
                    ? ''
                    : (Number(current.max_uses) as unknown as string),
            default_rank_id:
                current.default_rank_id === NO_RANK
                    ? ''
                    : current.default_rank_id,
            member_id: current.member_id === NO_MEMBER ? '' : current.member_id,
        }));

        const onSuccess = () => {
            onOpenChange(false);
            reset();
        };

        if (invite) {
            const { action } = InvitesController.update.form({
                unit: unit.slug,
                invite: invite.id,
            });
            patch(action, { preserveScroll: true, onSuccess });
        } else {
            const { action } = InvitesController.store.form({
                unit: unit.slug,
            });
            post(action, { preserveScroll: true, onSuccess });
        }
    };

    const toggleRole = (roleId: string, checked: boolean) => {
        if (checked) {
            setData('default_role_ids', [...data.default_role_ids, roleId]);
        } else {
            setData(
                'default_role_ids',
                data.default_role_ids.filter((id) => id !== roleId),
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {invite ? 'Edit invite' : 'Create invite link'}
                    </DialogTitle>
                    <DialogDescription>
                        Share the generated link with anyone you want to join{' '}
                        <strong>{unit.display_name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="notes">
                                Notes (optional)
                            </FieldLabel>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Discord recruitment Q2"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                            <FieldError
                                errors={
                                    errors.notes
                                        ? [{ message: errors.notes }]
                                        : []
                                }
                            />
                        </Field>
                    </FieldGroup>

                    {!invite &&
                        userlessMembers &&
                        userlessMembers.length > 0 && (
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="member_id">
                                        Link to existing member (optional)
                                    </FieldLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Invite someone to log in as a
                                        pre-created member. Once accepted, the
                                        link becomes inactive.
                                    </p>
                                    <Select
                                        value={data.member_id || NO_MEMBER}
                                        onValueChange={(v) =>
                                            setData(
                                                'member_id',
                                                v === NO_MEMBER ? '' : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="member_id"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="No member linked" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NO_MEMBER}>
                                                No member linked
                                            </SelectItem>
                                            {userlessMembers.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id}
                                                >
                                                    {m.formal_name as string}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError
                                        errors={
                                            errors.member_id
                                                ? [
                                                      {
                                                          message:
                                                              errors.member_id,
                                                      },
                                                  ]
                                                : []
                                        }
                                    />
                                </Field>
                            </FieldGroup>
                        )}

                    <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="expires_at">
                                Expires at
                            </FieldLabel>
                            <Input
                                id="expires_at"
                                type="datetime-local"
                                name="expires_at"
                                value={data.expires_at}
                                onChange={(e) =>
                                    setData('expires_at', e.target.value)
                                }
                            />
                            <FieldError
                                errors={
                                    errors.expires_at
                                        ? [{ message: errors.expires_at }]
                                        : []
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="max_uses">
                                Max uses (optional)
                            </FieldLabel>
                            <Input
                                id="max_uses"
                                type="number"
                                min={1}
                                name="max_uses"
                                placeholder="Unlimited"
                                value={data.max_uses}
                                onChange={(e) =>
                                    setData('max_uses', e.target.value)
                                }
                            />
                            <FieldError
                                errors={
                                    errors.max_uses
                                        ? [{ message: errors.max_uses }]
                                        : []
                                }
                            />
                        </Field>
                    </FieldGroup>

                    {!data.member_id && (
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="default_rank_id">
                                    Default rank
                                </FieldLabel>
                                <Select
                                    value={data.default_rank_id}
                                    onValueChange={(v) =>
                                        setData('default_rank_id', v)
                                    }
                                >
                                    <SelectTrigger
                                        id="default_rank_id"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a rank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={NO_RANK}>
                                            Use unit's entry rank
                                        </SelectItem>
                                        {ranks.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.display_name} (
                                                {r.abbreviation})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError
                                    errors={
                                        errors.default_rank_id
                                            ? [
                                                  {
                                                      message:
                                                          errors.default_rank_id,
                                                  },
                                              ]
                                            : []
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    )}

                    {roles.length > 0 && (
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Additional roles (optional)
                                </FieldLabel>
                                <p className="text-sm text-muted-foreground">
                                    New members always get the Member role.
                                </p>
                                <div className="flex flex-col gap-2 pt-2">
                                    {roles.map((role) => (
                                        <label
                                            key={role.id}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <Checkbox
                                                checked={data.default_role_ids.includes(
                                                    role.id,
                                                )}
                                                onCheckedChange={(c) =>
                                                    toggleRole(
                                                        role.id,
                                                        c === true,
                                                    )
                                                }
                                            />
                                            <span>{role.display_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        </FieldGroup>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {invite ? 'Save changes' : 'Create invite'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
