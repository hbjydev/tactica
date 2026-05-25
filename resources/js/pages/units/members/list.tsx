import AppLayout from '@/layouts/app-layout';
import { list, create } from '@/wayfinder/routes/unit/members';
import { memberColumns } from '@/components/views/members/columns';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@/wayfinder/types';
import UnitPermission from '@/wayfinder/App/Models/Enums/UnitPermission';
import { AuthGuard } from '@/components/auth-guard';
import { Paginated } from '@/types/units';
import { ColumnDef } from '@tanstack/react-table';

type Props = Inertia.Pages.Units.Members.List;

const UnitMembersList = ({ members, unit }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <div className="mb-8 flex items-center justify-between">
                <Heading
                    title="Members"
                    description={`The members of ${unit?.display_name}, with links to their service records.`}
                    className="mb-0! max-w-3xl!"
                />

                <AuthGuard permission={UnitPermission.MANAGE_MEMBERS}>
                    <Button variant="outline" asChild>
                        {/* oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain */}
                        <Link href={create({ unit: unit?.slug! })}>
                            <PlusIcon />
                            Add Member
                        </Link>
                    </Button>
                </AuthGuard>
            </div>

            <DataTable
                columns={memberColumns as ColumnDef<unknown>[]}
                data={members as unknown as Paginated<unknown>}
            />
        </div>
    );
};

UnitMembersList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Members',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default UnitMembersList;
