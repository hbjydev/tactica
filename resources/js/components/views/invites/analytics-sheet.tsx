import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { show } from '@/wayfinder/routes/unit/invites';
import { App } from '@/wayfinder/types';
import moment from 'moment';
import { useEffect, useState } from 'react';

type Props = {
    unit: App.Models.Unit;
    invite: App.Models.UnitInvite | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type ApiResponse = {
    invite: App.Models.UnitInvite;
    events: (App.Models.UnitInviteEvent & {
        user: App.Models.User | null;
    })[];
};

const EVENT_LABEL: Record<
    string,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
    }
> = {
    viewed: { label: 'Viewed', variant: 'outline' },
    accepted: { label: 'Accepted', variant: 'default' },
    already_member: { label: 'Already a member', variant: 'secondary' },
    rejected: { label: 'Rejected', variant: 'destructive' },
};

export const InviteAnalyticsSheet = ({
    unit,
    invite,
    open,
    onOpenChange,
}: Props) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !invite) {
            setData(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setData(null);
        fetch(show.url({ unit: unit.slug, invite: invite.id }), {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`Request failed: ${r.status}`);
                }
                return r.json();
            })
            .then((json: ApiResponse) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {
                if (!cancelled) setData(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, invite, unit.slug]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Invite analytics</SheetTitle>
                    <SheetDescription>
                        {invite?.notes ? (
                            <>Activity for "{invite.notes}".</>
                        ) : (
                            <>Activity for this invite link.</>
                        )}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 p-4">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <Spinner />
                        </div>
                    )}

                    {!loading && data && (
                        <>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-md border p-3">
                                    <div className="text-2xl font-semibold">
                                        {data.invite.views}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Views
                                    </div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-2xl font-semibold">
                                        {data.invite.uses}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Joins
                                    </div>
                                </div>
                                <div className="rounded-md border p-3">
                                    <div className="text-2xl font-semibold">
                                        {data.invite.views === 0
                                            ? '—'
                                            : `${Math.round((data.invite.uses / data.invite.views) * 100)}%`}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Conversion
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="text-sm font-semibold">
                                    Recent events
                                </div>
                                {data.events.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No activity yet.
                                    </p>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {data.events.map((ev) => {
                                            const meta = EVENT_LABEL[
                                                ev.event_type
                                            ] ?? {
                                                label: ev.event_type,
                                                variant: 'outline' as const,
                                            };
                                            return (
                                                <li
                                                    key={ev.id}
                                                    className="flex flex-col gap-1 rounded-md border p-2 text-sm"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant={
                                                                meta.variant
                                                            }
                                                        >
                                                            {meta.label}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {moment(
                                                                ev.created_at,
                                                            ).fromNow()}
                                                        </span>
                                                    </div>
                                                    {ev.user && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {ev.user
                                                                .display_name ??
                                                                ev.user
                                                                    .username}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};
