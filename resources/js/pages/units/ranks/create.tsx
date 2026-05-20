import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { RankForm } from '@/components/views/ranks/form';
import AppLayout from '@/layouts/app-layout';
import { create, list } from '@/routes/unit/ranks';
import { Inertia } from '@/wayfinder/types';

type Props = Inertia.Pages.Units.Ranks.Create;

const RanksCreate = ({ nextOrd, unit }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading
                title="Create Rank"
                description={`Create a new rank for your unit. Ranks are used to organize personnel and can be assigned to members to indicate their position within the unit hierarchy.`}
            />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <RankForm unit={unit!} nextOrd={nextOrd} />
                </CardContent>
            </Card>
        </div>
    );
};

RanksCreate.layout = (props: Props) => [
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
                title: 'Create',
                href: create({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default RanksCreate;
