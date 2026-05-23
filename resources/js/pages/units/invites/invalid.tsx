import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import MarketingLayout from '@/layouts/marketing-layout';
import { Link } from '@inertiajs/react';

type Props = {
    reason: 'not_found' | 'expired' | 'revoked' | 'exhausted' | string;
    unit: {
        slug: string;
        display_name: string;
    };
};

const REASON_COPY: Record<string, { title: string; description: string }> = {
    not_found: {
        title: 'Invite not found',
        description:
            "We couldn't find this invite. The link may have been mistyped or the invite was deleted.",
    },
    expired: {
        title: 'Invite expired',
        description:
            'This invite has expired and can no longer be used. Ask whoever shared it to generate a fresh one.',
    },
    revoked: {
        title: 'Invite revoked',
        description:
            'This invite has been revoked by an administrator and can no longer be used.',
    },
    exhausted: {
        title: 'Invite fully claimed',
        description:
            'This invite has reached its maximum number of uses. Ask whoever shared it for a new link.',
    },
};

const InvalidInvite = ({ reason, unit }: Props) => {
    const copy = REASON_COPY[reason] ?? REASON_COPY.not_found;

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>{copy.title}</CardTitle>
                    <CardDescription>
                        for <strong>{unit.display_name}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        {copy.description}
                    </p>
                    <Button asChild>
                        <Link href="/">Go home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

InvalidInvite.layout = (page: React.ReactNode) => (
    <MarketingLayout>{page}</MarketingLayout>
);

export default InvalidInvite;
