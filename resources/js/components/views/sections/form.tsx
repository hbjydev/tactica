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
import { Textarea } from '@/components/ui/textarea';
import { store, update } from '@/wayfinder/routes/unit/structure/sections';
import { App } from '@/wayfinder/types';
import { Form } from '@inertiajs/react';

type Props = {
    section?: App.Models.Section;
    sections: App.Models.Section[];
    unit: App.Models.Unit;
};

export const SectionForm = ({ section, sections, unit }: Props) => {
    const mode = section != undefined ? update : store;

    return (
        <Form
            {...mode.form({
                unit: unit.slug,
                section: section ? section.id : undefined,
            })}
            className="flex flex-col gap-6"
        >
            {({ errors, processing }) => (
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
                                defaultValue={
                                    section ? section.display_name : undefined
                                }
                                placeholder="Alpha 1-1"
                            />
                            {errors.display_name && (
                                <FieldError>{errors.display_name}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="avatar">
                                Section Avatar
                            </FieldLabel>
                            <Input
                                id="avatar"
                                type="file"
                                name="avatar"
                                tabIndex={2}
                            />
                            {errors.avatar && (
                                <FieldError>{errors.avatar}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">
                                Description (optional)
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                tabIndex={2}
                                placeholder="Fire support element"
                                defaultValue={
                                    section
                                        ? (section.description ?? undefined)
                                        : undefined
                                }
                            />

                            {errors.description && (
                                <FieldError>{errors.description}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="callsign">
                                Callsign (optional)
                            </FieldLabel>
                            <Input
                                id="callsign"
                                type="text"
                                name="callsign"
                                tabIndex={3}
                                defaultValue={
                                    section ? section.callsign : undefined
                                }
                                placeholder="1-1"
                            />
                            {errors.callsign && (
                                <FieldError>{errors.callsign}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="ord">Order</FieldLabel>
                            <Input
                                id="ord"
                                type="number"
                                name="ord"
                                required
                                tabIndex={4}
                                defaultValue={section ? section.ord : 0}
                            />
                            {errors.ord && (
                                <FieldError>{errors.ord}</FieldError>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="parent_id">
                                Parent Section
                            </FieldLabel>
                            <Select
                                name="parent_id"
                                defaultValue={
                                    section
                                        ? (section.parent_id ?? undefined)
                                        : undefined
                                }
                            >
                                <SelectTrigger
                                    id="section_id"
                                    tabIndex={5}
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Select a section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={'null'}>
                                        No parent section
                                    </SelectItem>

                                    {sections.map((section) => (
                                        <SelectItem
                                            key={section.id}
                                            value={section.id}
                                        >
                                            {section.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError
                                errors={
                                    errors.parent_id
                                        ? [{ message: errors.parent_id }]
                                        : []
                                }
                            />
                        </Field>
                    </FieldGroup>

                    <FieldGroup>
                        <Button
                            type="submit"
                            tabIndex={6}
                            disabled={processing}
                            data-test="save-button"
                        >
                            {processing && <Spinner />}
                            Save
                        </Button>
                    </FieldGroup>
                </>
            )}
        </Form>
    );
};
