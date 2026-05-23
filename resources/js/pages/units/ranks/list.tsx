import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/ui/data-table';
import { createRankColumns } from '@/components/views/ranks/columns';
import { create, list } from '@/wayfinder/routes/unit/ranks';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@/wayfinder/types';
import { hasPermission } from '@/lib/utils';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { AuthGuard } from '@/components/auth-guard';

type Props = Inertia.Pages.Units.Ranks.List;

const RanksList = ({ auth, unit, ranks }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <div className="mb-8 flex items-center justify-between">
                <Heading
                    title="Ranks"
                    description={`Manage the ranks for your unit. Ranks are used to organize personnel and can be assigned to members to indicate their position within the unit hierarchy.`}
                    className="mb-0! max-w-3xl!"
                />

                <AuthGuard permission={UnitPermission.MANAGE_RANKS}>
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
                columns={createRankColumns(unit!, ranks, auth)}
                data={ranks}
            />
        </div>
    );
};

RanksList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Ranks',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default RanksList;
