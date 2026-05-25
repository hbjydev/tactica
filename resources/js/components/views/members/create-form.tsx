import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import MembersController from '@/wayfinder/App/Http/Controllers/Units/MembersController';
import { App } from '@/wayfinder/types';
import { Form } from '@inertiajs/react';

type Props = {
    unit: App.Models.Unit;
    ranks: App.Models.Rank[];
};

const STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'reserve', label: 'Reservist' },
    { value: 'loa', label: 'On Leave' },
    { value: 'discharged', label: 'Discharged' },
] as const;

export const CreateMemberForm = ({ unit, ranks }: Props) => {
    const formType = MembersController.store.form({ unit: unit.slug });

    return (
        <Form
            {...formType}
            options={{ preserveScroll: true }}
            className="flex flex-col gap-6"
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="display_name">
                                Display Name
                            </FieldLabel>
                            <Input
                                id="display_name"
                                type="text"
                                name="display_name"
                                required
                                autoFocus
                                tabIndex={1}
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
                            <Select name="rank_id">
                                <SelectTrigger
                                    id="rank_id"
                                    tabIndex={2}
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Select a rank" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ranks.map((rank) => (
                                        <SelectItem
                                            key={rank.id}
                                            value={rank.id}
                                        >
                                            {rank.display_name} (
                                            {rank.abbreviation})
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
                            <Select name="status" defaultValue="active">
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
                            Create Member
                        </Button>
                    </FieldGroup>
                </>
            )}
        </Form>
    );
};
