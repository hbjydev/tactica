import { Unit, UnitMember } from "@/types/units";
import AppLayout from "@/layouts/app-layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    unit: Unit;
    member?: UnitMember;
    auth: {
        units: Unit[];
    };
};

const Dashboard = ({ unit }: Props) => {
    return (
        <div className="p-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="grid xl:col-span-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Welcome to your unit dashboard!</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Unit Announcements</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

Dashboard.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.member,
        breadcrumbs: [],
    },
];

export default Dashboard;
