import { Button } from '@/components/ui/button';
import { router, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import { destroy, edit, update } from '@/wayfinder/routes/unit/ranks';
import { App } from '@/wayfinder/types';

export const createRankColumns = (
    unit: App.Models.Unit,
    ranks: App.Models.Rank[],
): ColumnDef<App.Models.Rank>[] => {
    const maxOrd = Math.max(...ranks.map((r) => r.ord));
    const minOrd = Math.min(...ranks.map((r) => r.ord));

    const moveRank = (rank: App.Models.Rank, direction: 'up' | 'down') => {
        const newOrd = direction === 'up' ? rank.ord + 1 : rank.ord - 1;
        router.patch(
            update.url({ unit: unit.slug, rank: rank.id }),
            {
                display_name: rank.display_name,
                abbreviation: rank.abbreviation,
                description: rank.description,
                ord: newOrd,
            },
            { preserveScroll: true },
        );
    };

    return [
        {
            accessorKey: 'display_name',
            header: 'Display Name',
        },
        {
            accessorKey: 'abbreviation',
            header: 'Abbreviation',
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                return (
                    row.original.description || (
                        <span className="text-muted-foreground">&mdash;</span>
                    )
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const rank = row.original;
                const isHighest = rank.ord === maxOrd;
                const isLowest = rank.ord === minOrd;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isHighest}
                            onClick={() => moveRank(rank, 'up')}
                        >
                            <ChevronUpIcon />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={isLowest}
                            onClick={() => moveRank(rank, 'down')}
                        >
                            <ChevronDownIcon />
                        </Button>

                        <Button variant="outline" size="icon" asChild>
                            <Link
                                href={edit({ unit: unit.slug, rank: rank.id })}
                            >
                                <PencilIcon />
                            </Link>
                        </Button>

                        <Button variant="destructive" size="icon" asChild>
                            <Link
                                href={destroy({
                                    unit: unit.slug,
                                    rank: rank.id,
                                })}
                            >
                                <TrashIcon />
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ];
};
