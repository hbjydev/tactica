import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { dashboard } from '@/wayfinder/routes/unit';
import { Inertia } from '@/wayfinder/types';
import { MedalIcon, UsersIcon } from 'lucide-react';

type Props = Inertia.Pages.Units.Dashboard;

const Dashboard = ({ unit, ...data }: Props) => {
    return (
        <div className="flex flex-col p-4">
            <Heading
                title="Dashboard"
                description={unit?.display_name}
                className="lg:col-span-2 xl:col-span-3"
            />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="grid xl:grid-cols-2 gap-4 xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardDescription className="text-lg">
                                Ranks
                            </CardDescription>
                            <CardTitle className="flex items-center gap-4 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                <MedalIcon />
                                <span>{data.ranks_count as number}</span>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription className="text-lg">
                                Members
                            </CardDescription>
                            <CardTitle className="flex items-center gap-4 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                <UsersIcon />
                                <span>{data.members_count as number}</span>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="col-span-2">
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
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: dashboard({ slug: props.unit?.slug! }),
            },
        ],
    },
];

export default Dashboard;
