import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { SectionForm } from '@/components/views/sections/form';
import AppLayout from '@/layouts/app-layout';
import { edit, list, show } from '@/wayfinder/routes/unit/structure/sections';
import { Inertia } from '@/wayfinder/types';

type Props = Inertia.Pages.Units.Structure.Sections.Edit;

const SectionEdit = ({ section, unit, otherSections }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading title="Edit Member Profile" />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <SectionForm
                        section={section}
                        unit={unit!}
                        sections={otherSections}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

SectionEdit.layout = (props: Props) => [
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
                title: props.section.display_name,
                href: show({
                    unit: props.unit?.slug!,
                    section: props.section.id,
                }),
            },
            {
                title: 'Edit',
                href: edit({
                    unit: props.unit?.slug!,
                    section: props.section.id,
                }),
            },
        ],
    },
];

export default SectionEdit;
