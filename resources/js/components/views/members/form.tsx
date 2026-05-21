import { Button } from '@/components/ui/button';
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
import MembersController from '@/wayfinder/App/Http/Controllers/Units/MembersController';
import { App } from '@/wayfinder/types';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = {
    member: App.Models.UnitMember;
    unit: App.Models.Unit;
    ranks: App.Models.Rank[];
};

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'reserve', label: 'Reservist' },
    { value: 'loa', label: 'On Leave' },
    { value: 'discharged', label: 'Discharged' },
] as const;

export const MemberForm = ({ member, unit, ranks }: Props) => {
    const { data, setData, patch, processing, errors } = useForm({
        display_name: member.display_name,
        rank_id: member.rank_id,
        status: member.status,
    });

    const { action } = MembersController.update.form({
        unit: unit.slug,
        member: member.id,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch(action, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="display_name">Display Name</FieldLabel>
                    <Input
                        id="display_name"
                        type="text"
                        name="display_name"
                        required
                        autoFocus
                        tabIndex={1}
                        value={data.display_name}
                        onChange={(e) =>
                            setData('display_name', e.target.value)
                        }
                        placeholder="John Doe"
                    />
                    <FieldError
                        errors={
                            errors.display_name
                                ? [{ message: errors.display_name }]
                                : []
                        }
                    />
                </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field>
                    <FieldLabel htmlFor="rank_id">Rank</FieldLabel>
                    <Select
                        name="rank_id"
                        value={data.rank_id}
                        onValueChange={(value) => setData('rank_id', value)}
                    >
                        <SelectTrigger
                            id="rank_id"
                            tabIndex={2}
                            className="w-full"
                        >
                            <SelectValue placeholder="Select a rank" />
                        </SelectTrigger>
                        <SelectContent>
                            {ranks.map((rank) => (
                                <SelectItem key={rank.id} value={rank.id}>
                                    {rank.display_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError
                        errors={
                            errors.rank_id
                                ? [{ message: errors.rank_id }]
                                : []
                        }
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                        name="status"
                        value={data.status}
                        onValueChange={(value) =>
                            setData(
                                'status',
                                value as App.Models.UnitMember['status'],
                            )
                        }
                    >
                        <SelectTrigger
                            id="status"
                            tabIndex={3}
                            className="w-full"
                        >
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError
                        errors={
                            errors.status
                                ? [{ message: errors.status }]
                                : []
                        }
                    />
                </Field>
            </FieldGroup>

            <FieldGroup>
                <Button
                    type="submit"
                    tabIndex={4}
                    disabled={processing}
                    data-test="save-button"
                >
                    {processing && <Spinner />}
                    Save
                </Button>
            </FieldGroup>
        </form>
    );
};
