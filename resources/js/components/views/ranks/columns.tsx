import { Rank } from '@/types/units';
import { ColumnDef } from '@tanstack/react-table';

export const rankColumns: ColumnDef<Rank>[] = [
    {
        accessorKey: 'display_name',
        header: 'Display Name',
    },
    {
        accessorKey: 'abbreviation',
        header: 'Abbreviation',
    }
];
