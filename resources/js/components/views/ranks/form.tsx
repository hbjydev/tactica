import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import RanksController from "@/wayfinder/App/Http/Controllers/Units/RanksController";
import { App } from "@/wayfinder/types";
import { Form } from "@inertiajs/react";

type Props = {
    rank?: App.Models.Rank;
    unit: App.Models.Unit;
    nextOrd?: number;
};

export const RankForm = ({ rank, unit, nextOrd }: Props) => {
    let formType = rank
        ? RanksController.update.form({ unit: unit.slug, rank: rank.id })
        : RanksController.store.form({ unit: unit.slug });

    return (
        <Form
            {...formType}
            options={{
                preserveScroll: true,
            }}
            className="flex flex-col gap-6"
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                defaultValue={rank ? rank.display_name : undefined}
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
                            <FieldLabel htmlFor="abbreviation">Abbreviation</FieldLabel>
                            <Input
                                id="abbreviation"
                                type="text"
                                name="abbreviation"
                                required
                                tabIndex={2}
                                placeholder="LCpl"
                                defaultValue={rank ? rank.abbreviation : undefined}
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
                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                tabIndex={3}
                                placeholder="Granted after 8 operations."
                                defaultValue={rank ? rank.description ?? undefined : undefined}
                            />

                            <FieldError
                                errors={
                                    errors.description
                                        ? [
                                              {
                                                  message:
                                                      errors.description,
                                              },
                                          ]
                                        : []
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="order">Order</FieldLabel>
                            <Input
                                id="order"
                                name="ord"
                                type="number"
                                required
                                tabIndex={4}
                                defaultValue={
                                    rank
                                        ? rank.ord ?? undefined
                                        : typeof nextOrd !== 'undefined'
                                            ? nextOrd
                                            : undefined
                                }
                            />

                            {errors.ord && <FieldError>{errors.ord}</FieldError>}
                        </Field>
                    </FieldGroup>

                    <FieldGroup>
                        <Button
                            type="submit"
                            tabIndex={5}
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
