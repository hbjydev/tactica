import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { CreateMemberForm } from '@/components/views/members/create-form';
import AppLayout from '@/layouts/app-layout';
import { create, list } from '@/wayfinder/routes/unit/members';
import { App } from '@/wayfinder/types';
import type { InertiaConfig } from '@inertiajs/core';

type Props = {
    ranks: App.Models.Rank[];
} & InertiaConfig['sharedPageProps'];

const UnitMembersCreate = ({ unit, ranks }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading
                title="Add Member"
                description="Manually add a member to your unit without requiring them to log in. You can link their account later once they join the platform."
            />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <CreateMemberForm unit={unit!} ranks={ranks} />
                </CardContent>
            </Card>
        </div>
    );
};

UnitMembersCreate.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Members',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: 'Add Member',
                // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                href: create({ unit: props.unit?.slug! }),
            },
        ],
    },
];

export default UnitMembersCreate;
