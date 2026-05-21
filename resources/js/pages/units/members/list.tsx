import AppLayout from '@/layouts/app-layout';
import { list } from '@/wayfinder/routes/unit/members';
import { memberColumns } from '@/components/views/members/columns';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/heading';
import { App, Inertia } from '@/wayfinder/types';

type Props = Inertia.Pages.Units.Members.List;

const UnitMembersList = ({ members, unit }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <Heading
                title="Members"
                description={`The members of ${unit?.display_name}, with links to their service records.`}
            />
            <DataTable
                columns={memberColumns}
                // @ts-expect-error This fails because of some Wayfinder issues (it doesn't typecast pagination)
                data={members.data as App.Models.UnitMember[]}
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
