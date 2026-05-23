import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { App } from "@/wayfinder/types";

type Props = {
    slot?: App.Models.Slot;
};

export const SlotModal = ({ slot }: Props) => {
    return (
        <form>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">Open</Button>
                </SheetTrigger>

                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Slot</SheetTitle>
                        <SheetDescription>
                            Edit the details of this slot, such as its name, description, and assigned personnel.
                        </SheetDescription>
                    </SheetHeader>

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
                                {/*errors.display_name && <FieldError>{errors.display_name}</FieldError>*/}
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
                                {/*errors.callsign && <FieldError>{errors.callsign}</FieldError>*/}
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="is_leader"
                                    name="is_leader"
                                    tabIndex={3}
                                />
                                <FieldContent>
                                    <FieldLabel htmlFor="callsign" defaultChecked={slot ? slot.is_leader : false}>Is Leader?</FieldLabel>
                                    <FieldDescription>
                                        Whether or not this slot is a leader of this
                                        section. Typically, you might assign two
                                        slots as leaders as 1st and 2nd in command.
                                    </FieldDescription>
                                    {/*errors.is_leader && <FieldError>{errors.is_leader}</FieldError>*/}
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
                                {/*errors.ord && <FieldError>{errors.ord}</FieldError>*/}
                            </Field>
                        </FieldGroup>
                    </div>

                    <SheetFooter>
                        <Button type="submit">Save changes</Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </form>
    );
};
