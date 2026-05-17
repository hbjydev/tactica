import AppLayout from "@/layouts/app-layout";
import { Paginated, Unit, UnitMember } from "@/types/units";
import { list } from "@/routes/unit/members";
import { memberColumns } from "@/components/views/members/columns";
import { DataTable } from "@/components/ui/data-table";
import Heading from "@/components/heading";

interface Props {
    unit: Unit;
    member?: UnitMember;
    members: Paginated<UnitMember>;
    auth: {
        units: Unit[];
    };
}

const UnitMembersList = ({ members, unit }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <Heading
                title="Members"
                description={`The members of ${unit.display_name}, with links to their service records.`}
            />
            <DataTable columns={memberColumns} data={members} />
        </div>
    );
};

UnitMembersList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.member,
        breadcrumbs: [
            {
                title: 'Members',
                href: list({ unit: props.unit.slug }),
            }
        ],
    },
];

export default UnitMembersList;
