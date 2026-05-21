import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { toMemberName } from '@/lib/utils';
import { edit, list, show } from '@/wayfinder/routes/unit/members';
import { Link } from '@inertiajs/react';
import { Inertia } from '@/wayfinder/types';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';

type Props = Inertia.Pages.Units.Members.Show;

const UnitMemberShow = ({ member, unit }: Props) => {
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
        <div className="grid gap-4 p-4 xl:grid-cols-7">
            <div className="flex items-center justify-between xl:col-span-7">
                <Heading
                    title={`Personnel record: ${toMemberName(member)}`}
                    description={`Detailed information about ${toMemberName(member)}'s service in ${unit?.display_name}.`}
                    className="!mb-0"
                />

                <Button variant="outline" asChild>
                    {/* oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain */}
                    <Link href={edit({ unit: unit?.slug!, member: member.id })}>
                        <PencilIcon />
                        Edit
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 xl:col-span-2">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="flex flex-col">
                    <div className="flex h-8 flex-col items-center justify-center rounded-t-xl border-x border-t bg-muted">
                        <span className="text-sm font-medium">
                            {member.id.toUpperCase()}
                        </span>
                    </div>
                    <div
                        className={`${memberStatusColor} flex h-16 flex-col items-center justify-center border-x`}
                    >
                        <span className="text-lg font-medium">
                            {memberStatusText}
                        </span>
                    </div>
                    <div className="flex h-8 flex-col items-center justify-center rounded-b-xl border-x border-b bg-muted">
                        <span className="text-sm font-medium">
                            Member since{' '}
                            {moment(member.created_at)
                                .local()
                                .format('DD/MM/YYYY')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 xl:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            A summary of {toMemberName(member)}'s current status
                            and role within the unit.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-2 justify-between gap-4">
                            <span className="font-bold">Name</span>
                            <span>{member.display_name}</span>

                            <Separator className="col-span-2" />

                            <span className="font-bold">Rank</span>
                            <span>{member.rank?.display_name}</span>

                            <Separator className="col-span-2" />

                            <span className="font-bold">Rank Held Since</span>
                            <span>
                                {moment(member.rank_changed_at)
                                    .local()
                                    .format('DD/MM/YYYY')}
                            </span>

                            <Separator className="col-span-2" />

                            <span className="font-bold">Status</span>
                            <span>{memberStatusText}</span>

                            <Separator className="col-span-2" />

                            <span className="font-bold">Status Changed At</span>
                            <span>
                                {moment(member.status_changed_at)
                                    .local()
                                    .format('DD/MM/YYYY')}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{toMemberName(member)}</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>

            <div className="grid gap-4 xl:col-span-7">
                <Heading
                    variant="small"
                    title="Service history"
                    description={`A detailed record of ${toMemberName(member)}'s service in ${unit?.display_name}, including deployments, awards, and disciplinary actions.`}
                />
                <DataTable data={[]} columns={[]} />
            </div>
        </div>
    );
};

UnitMemberShow.layout = (props: Props) => [
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
                title: toMemberName(props.member),
                href: show({
                    // oxlint-disable-next-line typescript/no-non-null-asserted-optional-chain
                    unit: props.unit?.slug!,
                    member: props.member.id,
                }),
            },
        ],
    },
];

export default UnitMemberShow;
