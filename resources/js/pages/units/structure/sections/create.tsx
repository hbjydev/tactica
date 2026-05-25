import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { SectionForm } from '@/components/views/sections/form';
import AppLayout from '@/layouts/app-layout';
import { create, list } from '@/wayfinder/routes/unit/structure/sections';
import { Inertia } from '@/wayfinder/types';

type Props = Inertia.Pages.Units.Structure.Sections.Create;

const SectionCreate = ({ otherSections, unit }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading title="Create new section" />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <SectionForm sections={otherSections} unit={unit!} />
                </CardContent>
            </Card>
        </div>
    );
};

SectionCreate.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'Sections',
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: 'Create',
                href: create({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default SectionCreate;
