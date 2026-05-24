import AppLayout from '@/layouts/app-layout';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';
import { dashboard } from '@/wayfinder/routes/unit';
import { Inertia } from '@/wayfinder/types';
import { LucideIcon, MedalIcon, Users2Icon, UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { list as listRanks } from '@/wayfinder/routes/unit/ranks';
import { list as listMembers } from '@/wayfinder/routes/unit/members';
import { list as listSections } from '@/wayfinder/routes/unit/structure/sections';
import { type UrlMethodPair } from '@inertiajs/core';

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
                <div className="grid xl:grid-cols-3 gap-4 xl:col-span-2">
                    <StatCard
                        name="Ranks"
                        icon={MedalIcon}
                        value={data.ranks_count as number}
                        link={listRanks({ slug: unit?.slug! })}
                    />

                    <StatCard
                        name="Members"
                        icon={UsersIcon}
                        value={data.members_count as number}
                        link={listMembers({ slug: unit?.slug! })}
                    />

                    <StatCard
                        name="Sections"
                        icon={Users2Icon}
                        value={data.sections_count as number}
                        link={listSections({ slug: unit?.slug! })}
                    />

                    <Card className="col-span-3">
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

const StatCard = ({ name, value, icon: Icon, link }: { name: string, value: number, icon: LucideIcon, link?: string | UrlMethodPair | undefined }) => {
    return (
        <Card>
            <CardHeader>
                <CardDescription className="text-lg">{name}</CardDescription>
                <CardTitle className="flex items-center gap-4 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Icon />
                    <span>{value}</span>
                </CardTitle>
                <CardAction>
                    <Button variant="outline" asChild>
                        <Link href={link}>
                            View all
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
        </Card>
    )
}

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
