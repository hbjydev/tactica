import AppLayout from "@/layouts/app-layout";
import { Inertia } from "@/wayfinder/types";
import { show, update } from "@/wayfinder/routes/unit/branding";
import Heading from "@/components/heading";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarInput } from "@/components/avatar-input";
import { useInitials } from "@/hooks/use-initials";
import { Button } from "@/components/ui/button";
import { Form } from "@inertiajs/react";
import { Spinner } from "@/components/ui/spinner";

type Props = Inertia.Pages.Units.Settings.Branding;

const BrandingSettings = ({ unit }: Props) => {
    const getInitials = useInitials();

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading
                title="Branding"
                description="Customize your unit's appearance across Tactica"
            />

            <Card>
                <CardContent>
                    <Form {...update.form({ unit: unit?.slug! })}>
                        {({ processing, errors }) => (
                            <FieldGroup>

                                <Field>
                                    <FieldLabel>Slug</FieldLabel>
                                    <Input
                                        type="text"
                                        autoFocus
                                        disabled
                                        tabIndex={-1}
                                        defaultValue={unit?.slug}
                                    />
                                    <FieldDescription>
                                        This cannot be changed and is used in your
                                        unit's URL.
                                    </FieldDescription>

                                    {errors.slug && <FieldError>{errors.slug}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="display_name">Name</FieldLabel>
                                    <Input
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        name="display_name"
                                        id="display_name"
                                        defaultValue={unit?.display_name}
                                    />
                                    {errors.display_name && <FieldError>{errors.display_name}</FieldError>}
                                </Field>

                                <AvatarInput
                                    label="Unit Icon/Logo"
                                    currentUrl={
                                        unit?.avatar_url as string | null | undefined
                                    }
                                    fallback={
                                        unit?.display_name
                                            ? getInitials(unit.display_name)
                                            : '?'
                                    }
                                    sendNullOnRemove
                                    error={errors.avatar}
                                />

                                <Field>
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <Textarea
                                        tabIndex={3}
                                        name="description"
                                        id="description"
                                        defaultValue={unit?.description!}
                                    />
                                    {errors.description && <FieldError>{errors.description}</FieldError>}
                                </Field>

                                <Button disabled={processing} type="submit" size="lg">
                                    {processing && <Spinner />}
                                    Save changes
                                </Button>

                            </FieldGroup>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

BrandingSettings.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Branding',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: show({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default BrandingSettings;
