import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/public/unit';
import { Textarea } from '@/components/ui/textarea';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group';

interface Props {
    base: { baseDomain: string };
}

export default function CreateUnit({ base: { baseDomain } }: Props) {
    return (
        <>
            <Head title="New Unit" />
            <Form
                {...store.form()}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="display_name">
                                    Display Name
                                </Label>
                                <Input
                                    id="display_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    name="display_name"
                                    placeholder="23rd Ranger Battalion"
                                />
                                <InputError
                                    message={errors.display_name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <InputGroup>
                                    <InputGroupInput
                                        id="slug"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        name="slug"
                                        placeholder="23rd-ranger"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>
                                            .{baseDomain}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    tabIndex={3}
                                    name="description"
                                    placeholder="The 23rd Ranger Battalion is an elite unit..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="create-unit-button"
                            >
                                {processing && <Spinner />}
                                Create unit
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

CreateUnit.layout = {
    title: 'Create a unit',
    description: 'Start using Tactica by making a unit of your own!',
};
