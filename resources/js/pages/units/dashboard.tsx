import AppLayout from "@/layouts/app-layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { InertiaConfig } from '@inertiajs/core';
import Heading from "@/components/heading";
import { dashboard } from "@/routes/unit";

type Props = InertiaConfig["sharedPageProps"];

const Dashboard = ({ unit }: Props) => {
    return (
        <div className="p-4 flex flex-col">
            <Heading
                title="Dashboard"
                description={unit?.display_name}
                className="lg:col-span-2 xl:col-span-3"
            />

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
        </div>
    );
};

Dashboard.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard({ slug: props.unit?.slug! }),
            }
        ],
    },
];

export default Dashboard;
