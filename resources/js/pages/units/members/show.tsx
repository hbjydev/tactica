import Heading from "@/components/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import AppLayout from "@/layouts/app-layout";
import { toMemberName } from "@/lib/utils";
import { list } from "@/routes/unit/members";
import { Unit, UnitMember } from "@/types/units";
import moment from "moment";

type Props = {
    unit: Unit;
    member: UnitMember;
    auth: {
        units: Unit[];
        member?: UnitMember;
    };
};

const UnitMemberShow = ({
    member,
    unit,
}: Props) => {
    let memberStatusText;
    let memberStatusColor;
    switch (member.status) {
        case 'active':
            memberStatusColor = 'bg-green-500';
            memberStatusText = 'Active';
            break;
        case 'reserve':
            memberStatusColor = 'bg-yellow-500';
            memberStatusText = 'Reservist';
            break;
        case 'loa':
            memberStatusColor = 'bg-blue-500';
            memberStatusText = 'On Leave';
            break;
        case 'discharged':
            memberStatusColor = 'bg-red-500';
            memberStatusText = 'Discharged';
            break;
    }

    return (
        <div className="p-4 grid xl:grid-cols-7 gap-4">
            <div className="flex flex-col xl:col-span-7">
                <Heading
                    title={`Personnel record: ${toMemberName(member)}`}
                    description={`Detailed information about ${toMemberName(member)}'s service in ${unit.display_name}.`}
                />
            </div>

            <div className="grid gap-4 xl:col-span-2">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="flex flex-col">
                    <div className="bg-muted h-8 border-x border-t rounded-t-xl flex flex-col items-center justify-center">
                        <span className="text-sm font-medium">{member.id.toUpperCase()}</span>
                    </div>
                    <div className={`${memberStatusColor} border-x h-16 flex flex-col items-center justify-center`}>
                        <span className="text-lg font-medium">{memberStatusText}</span>
                    </div>
                    <div className="bg-muted border-x border-b h-8 rounded-b-xl flex flex-col items-center justify-center">
                        <span className="text-sm font-medium">Member since {moment(member.created_at).local().format('DD/MM/YYYY')}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 xl:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>A summary of {toMemberName(member)}'s current status and role within the unit.</CardDescription>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-2 gap-4 justify-between">
                            <span className="font-bold">Name</span>
                            <span>{member.display_name}</span>
                            <span className="font-bold">Rank</span>
                            <span>{member.rank?.display_name}</span>
                            <span className="font-bold">Rank Held Since</span>
                            <span>{moment(member.rank_changed_at).local().format('DD/MM/YYYY')}</span>
                            <span className="font-bold">Status</span>
                            <span>{memberStatusText}</span>
                            <span className="font-bold">Status Changed At</span>
                            <span>{moment(member.status_changed_at).local().format('DD/MM/YYYY')}</span>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{toMemberName(member)}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-4 xl:col-span-7">
                <Heading
                    variant="small"
                    title="Service history"
                    description={`A detailed record of ${toMemberName(member)}'s service in ${unit.display_name}, including deployments, awards, and disciplinary actions.`}
                />
                <DataTable
                    data={[]}
                    columns={[]}
                />
            </div>
        </div>
    );
};

UnitMemberShow.layout = (props: Props) => [
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

export default UnitMemberShow;
