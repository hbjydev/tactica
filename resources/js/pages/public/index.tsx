import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';
import MarketingLayout from '@/layouts/marketing-layout';
import { login } from '@/wayfinder/routes/index';
import { create } from '@/wayfinder/routes/home/unit';
import type { ReactNode } from 'react';
import {
    IconUsers,
    IconMedal,
    IconLayoutDashboard,
    IconArrowRight,
    IconShield,
} from '@tabler/icons-react';

export default function LandingPage() {
    return (
        <>
            <Head title="Military unit management, done right" />

            {/* Hero */}
            <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center md:py-48">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
                >
                    <AppLogoIcon className="h-[600px] w-[600px] fill-current text-foreground" />
                </div>

                <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                        <IconShield className="size-3.5" />
                        Built for serious units
                    </div>

                    <h1 className="font-heading text-5xl leading-tight font-bold tracking-tight text-foreground md:text-7xl">
                        Command your unit.{' '}
                        <span className="text-muted-foreground">
                            Not your spreadsheets.
                        </span>
                    </h1>

                    <p className="max-w-xl text-lg text-muted-foreground">
                        Tactica gives military gaming units everything they need
                        — roster management, rank structures, and a dedicated
                        dashboard — all in one place.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button size="lg" asChild>
                            <a href={create.url()}>
                                Create your unit
                                <IconArrowRight className="ml-1.5 size-4" />
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a href={login.url()}>Sign in</a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section
                id="features"
                className="border-t border-border/50 bg-muted/20 px-6 py-24"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Everything your unit needs
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            No more juggling tools. Tactica covers the full
                            lifecycle of running a unit.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-border/60 bg-background/60">
                            <CardHeader className="pb-3">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
                                    <IconUsers className="size-5 text-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    Roster Management
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Track every member of your unit. Know who's
                                    active, who's on leave, and who's risen
                                    through the ranks — all without opening a
                                    single spreadsheet.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 bg-background/60">
                            <CardHeader className="pb-3">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
                                    <IconMedal className="size-5 text-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    Rank Structure
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Define your own rank ladder, assign members,
                                    and track promotions over time. Your chain
                                    of command, exactly how you want it.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 bg-background/60">
                            <CardHeader className="pb-3">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
                                    <IconLayoutDashboard className="size-5 text-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    Unit Dashboard
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    A central home for your unit. Get an instant
                                    snapshot of your roster, recent activity,
                                    and everything happening across your
                                    command.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-16 text-center">
                        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                            Up and running in minutes
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            No onboarding call, no sales demo. Just create a
                            unit and get to work.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                step: '01',
                                title: 'Create your unit',
                                description:
                                    'Give your unit a name, a slug, and a short description. Done. Your dedicated subdomain is live immediately.',
                            },
                            {
                                step: '02',
                                title: 'Build your roster',
                                description:
                                    "Invite members, define your rank structure, and assign everyone their place. Tactica keeps track so you don't have to.",
                            },
                            {
                                step: '03',
                                title: 'Run your operation',
                                description:
                                    'Manage promotions, track member activity, and keep your unit organised from a single dashboard built for the job.',
                            },
                        ].map(({ step, title, description }) => (
                            <div key={step} className="flex flex-col gap-4">
                                <span className="font-heading text-5xl font-bold text-border tabular-nums">
                                    {step}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="border-t border-border/50 bg-muted/20 px-6 py-24">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                    <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        Ready to take command?
                    </h2>
                    <p className="text-muted-foreground">
                        It's free to get started. No credit card, no commitment
                        — just your unit, organised.
                    </p>
                    <Button size="lg" asChild>
                        <a href={create.url()}>
                            Create your unit
                            <IconArrowRight className="ml-1.5 size-4" />
                        </a>
                    </Button>
                </div>
            </section>
        </>
    );
}

LandingPage.layout = (page: ReactNode) => (
    <MarketingLayout>{page}</MarketingLayout>
);
