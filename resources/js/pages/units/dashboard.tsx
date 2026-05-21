import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { dashboard } from '@/wayfinder/routes/unit';
import { Inertia } from '@/wayfinder/types';

type Props = Inertia.Pages.Units.Dashboard;

const Dashboard = ({ unit }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <Heading
                title="Dashboard"
                description={unit?.display_name}
                className="lg:col-span-2 xl:col-span-3"
            />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="grid gap-4 xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Welcome to your unit dashboard!
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Unit Announcements
                            </CardTitle>
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
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard({ slug: props.unit?.slug! }),
            },
        ],
    },
];

export default Dashboard;
