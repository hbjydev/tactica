import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { create, list, store } from '@/routes/unit/ranks';
import type { InertiaConfig } from '@inertiajs/core';
import { Form } from '@inertiajs/react';

type Props = {} & InertiaConfig['sharedPageProps'];

const RanksCreate = ({ unit }: Props) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Heading
                title="Create Rank"
                description={`Create a new rank for your unit. Ranks are used to organize personnel and can be assigned to members to indicate their position within the unit hierarchy.`}
            />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <Form
                        {...store.form({ unit: unit?.slug! })}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="display_name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            id="display_name"
                                            type="text"
                                            name="display_name"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            placeholder="Lance Corporal"
                                        />
                                        <FieldError
                                            errors={
                                                errors.display_name
                                                    ? [
                                                          {
                                                              message:
                                                                  errors.display_name,
                                                          },
                                                      ]
                                                    : []
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel>Abbreviation</FieldLabel>
                                        <Input
                                            id="abbreviation"
                                            type="text"
                                            name="abbreviation"
                                            required
                                            tabIndex={2}
                                            placeholder="LCpl"
                                        />

                                        <FieldError
                                            errors={
                                                errors.abbreviation
                                                    ? [
                                                          {
                                                              message:
                                                                  errors.abbreviation,
                                                          },
                                                      ]
                                                    : []
                                            }
                                        />
                                    </Field>
                                </FieldGroup>

                                <FieldGroup>
                                    <Button
                                        type="submit"
                                        tabIndex={3}
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
                </CardContent>
            </Card>
        </div>
    );
};

RanksCreate.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Ranks',
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: 'Create',
                href: create({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default RanksCreate;
