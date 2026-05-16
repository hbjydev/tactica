import { Rank, Unit } from "@/types/units";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/ui/data-table";
import { rankColumns } from "@/components/views/ranks/columns";

type Props = {
    unit: Unit;
    ranks: Rank[];
    auth: {
        units: Unit[];
    };
};

const RanksList = ({ ranks }: Props) => {
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Ranks</h1>
            <DataTable columns={rankColumns} data={ranks} />
        </div>
    );
};

RanksList.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        breadcrumbs: [],
    },
];

export default RanksList;
