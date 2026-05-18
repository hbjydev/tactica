import { Rank, Unit, UnitMember } from "@/types/units";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/ui/data-table";
import { rankColumns } from "@/components/views/ranks/columns";
import { create, list } from "@/routes/unit/ranks";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "@inertiajs/react";

type Props = {
    unit: Unit;
    ranks: Rank[];
    auth: {
        units: Unit[];
        member?: UnitMember;
    };
};

const RanksList = ({ unit, ranks }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <div className="flex items-center justify-between mb-8">
                <Heading
                    title="Ranks"
                    description={`Manage the ranks for your unit. Ranks are used to organize personnel and can be assigned to members to indicate their position within the unit hierarchy.`}
                    className="mb-0! max-w-3xl!"
                />

                <Button
                    variant="outline"
                    asChild
                >
                    <Link href={create({ unit: unit.slug! })}>
                        <PlusIcon />
                        Create
                    </Link>
                </Button>
            </div>

            <DataTable columns={rankColumns} data={ranks} />
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
                href: list({ unit: props.unit.slug }),
            }
        ],
    },
];

export default RanksList;
