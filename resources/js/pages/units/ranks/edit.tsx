import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { RankForm } from '@/components/views/ranks/form';
import AppLayout from '@/layouts/app-layout';
import { list } from '@/routes/unit/ranks';
import { edit } from '@/wayfinder/routes/unit/ranks';
import { App } from '@/wayfinder/types';
import type { InertiaConfig } from '@inertiajs/core';

type Props = {
    rank: App.Models.Rank;
} & InertiaConfig['sharedPageProps'];

const RanksEdit = ({ rank, unit }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading title="Update Rank" />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <RankForm rank={rank} unit={unit!} />
                </CardContent>
            </Card>
        </div>
    );
};

RanksEdit.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Ranks',
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: 'Update',
                href: edit({ unit: props.unit?.slug!, rank: props.rank.id }),
            },
        ],
    },
];

export default RanksEdit;
