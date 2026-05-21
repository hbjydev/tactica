import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { MemberForm } from '@/components/views/members/form';
import AppLayout from '@/layouts/app-layout';
import { toMemberName } from '@/lib/utils';
import { edit, list, show } from '@/wayfinder/routes/unit/members';
import { App } from '@/wayfinder/types';
import type { InertiaConfig } from '@inertiajs/core';

type Props = {
    member: App.Models.UnitMember;
    ranks: App.Models.Rank[];
} & InertiaConfig['sharedPageProps'];

const UnitMemberEdit = ({ member, unit, ranks }: Props) => {
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-4">
            <Heading title="Edit Member Profile" />

            <Card>
                <CardContent className="flex flex-col gap-8">
                    <MemberForm member={member} unit={unit!} ranks={ranks} />
                </CardContent>
            </Card>
        </div>
    );
};

UnitMemberEdit.layout = (props: Props) => [
    AppLayout,
    {
        unit: props.unit,
        auth: props.auth,
        member: props.auth.member,
        breadcrumbs: [
            {
                title: 'Members',
                href: list({ unit: props.unit?.slug! }),
            },
            {
                title: toMemberName(props.member),
                href: show({
                    unit: props.unit?.slug!,
                    member: props.member.id,
                }),
            },
            {
                title: 'Edit',
                href: edit({
                    unit: props.unit?.slug!,
                    member: props.member.id,
                }),
            },
        ],
    },
];

export default UnitMemberEdit;
