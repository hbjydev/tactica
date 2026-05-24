import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner";
import { store, update } from "@/wayfinder/routes/unit/structure/sections/slot";
import { App } from "@/wayfinder/types";
import { Form, usePage } from "@inertiajs/react";
import { useState } from "react";

type Props = {
    slot?: App.Models.Slot;
    section?: App.Models.Section;
};

export const SlotModal = ({ slot, section }: Props) => {
    const unit = usePage().props.unit!;
    const op = slot ? 'Update' : 'Create';
    const op2 = slot ? 'Edit' : 'Enter';
    const [open, setOpen] = useState(false);
    const [isLeader, setIsLeader] = useState(slot ? slot.is_leader ? 1 : 0 : 0);

    const action = slot != undefined ? update : store;

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{op} Slot</SheetTitle>
                    <SheetDescription>
                        {op2} the details of this slot, such as its name, description, and assigned personnel.
                    </SheetDescription>
                </SheetHeader>

                <Form
                    {...action.form({
                        unit: unit.slug,
                        section: section?.id!,
                        slot: slot ? slot.id : undefined,
                    })}
                    onSuccess={(response) => {
                        setOpen(false);
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="display_name">Display Name</FieldLabel>
                                        <Input
                                            id="display_name"
                                            type="text"
                                            name="display_name"
                                            required
                                            tabIndex={1}
                                            defaultValue={slot ? slot.display_name : undefined}
                                        />
                                        {errors.display_name && <FieldError>{errors.display_name}</FieldError>}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="callsign">Callsign (optional)</FieldLabel>
                                        <Input
                                            id="callsign"
                                            type="text"
                                            name="callsign"
                                            tabIndex={2}
                                            defaultValue={slot ? (slot.callsign ?? undefined) : undefined}
                                        />
                                        <FieldDescription>
                                            What callsign is assigned to this slot? This
                                            is typically used for radio communication,
                                                and may be left blank if not applicable.
                                        </FieldDescription>
                                        {errors.callsign && <FieldError>{errors.callsign}</FieldError>}
                                    </Field>

                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id="is_leader"
                                            name="is_leader"
                                            value={isLeader}
                                            checked={isLeader === 1}
                                            onCheckedChange={checked => setIsLeader(checked ? 1 : 0)}
                                            tabIndex={3}
                                        />
                                        <FieldContent>
                                            <FieldLabel htmlFor="is_leader" defaultChecked={slot ? slot.is_leader : false}>Is Leader?</FieldLabel>
                                            <FieldDescription>
                                                Whether or not this slot is a leader of this
                                                section. Typically, you might assign two
                                                slots as leaders as 1st and 2nd in command.
                                            </FieldDescription>
                                            {errors.is_leader && <FieldError>{errors.is_leader}</FieldError>}
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="ord">Sort order</FieldLabel>
                                        <Input
                                            id="ord"
                                            type="number"
                                            name="ord"
                                            required
                                            tabIndex={4}
                                            defaultValue={slot ? slot.ord : 0}
                                        />
                                        <FieldDescription>
                                            Used to re-order slots within a section.
                                            Slots with higher orders will be sorted
                                            after those with lower orders.
                                        </FieldDescription>
                                        {errors.ord && <FieldError>{errors.ord}</FieldError>}
                                    </Field>
                                </FieldGroup>
                            </div>

                            <SheetFooter>
                                <Button disabled={processing} type="submit">
                                    {processing && <Spinner />}
                                    Save changes
                                </Button>
                                <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </>
                    )}
                </Form>
            </SheetContent>
        </Sheet>
    );
};
