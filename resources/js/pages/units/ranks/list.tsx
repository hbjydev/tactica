import { Rank, Unit } from "@/types/units";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/ui/data-table";
import { rankColumns } from "@/components/views/ranks/columns";
import { list } from "@/routes/unit/ranks";
import Heading from "@/components/heading";

type Props = {
    unit: Unit;
    ranks: Rank[];
    auth: {
        units: Unit[];
    };
};

const RanksList = ({ ranks }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <Heading
                title="Ranks"
                description={`Manage the ranks for your unit. Ranks are used to organize personnel and can be assigned to members to indicate their position within the unit hierarchy.`}
            />
            <DataTable columns={rankColumns} data={ranks} />
        </div>
    );
};

RanksList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [
            {
                title: 'Ranks',
                href: list({ unit: props.unit.slug }),
            }
        ],
    },
];

export default RanksList;
