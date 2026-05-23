import AppLayout from '@/layouts/app-layout';
import { create, list } from '@/wayfinder/routes/unit/structure/sections';
import { sectionColumns } from '@/components/views/sections/columns';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/heading';
import { App, Inertia } from '@/wayfinder/types';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';

type Props = Inertia.Pages.Units.Structure.Sections.List;

const SectionsList = ({ sections, unit }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <div className="mb-8 flex items-center justify-between">
                <Heading
                    title="Sections"
                    description={`The operational sections of ${unit?.display_name}.`}
                    className="mb-0! max-w-3xl!"
                />
                <AuthGuard permission={UnitPermission.MANAGE_SECTIONS}>
                    <Button variant="outline" asChild>
                        {/* oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain */}
                        <Link href={create({ unit: unit?.slug! })}>
                            <PlusIcon />
                            Create
                        </Link>
                    </Button>
                </AuthGuard>
            </div>
            <DataTable
                columns={sectionColumns}
                // @ts-expect-error This fails because of some Wayfinder issues (it doesn't typecast pagination)
                data={sections.data as App.Models.Section[]}
            />
        </div>
    );
};

SectionsList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'Sections',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default SectionsList;
