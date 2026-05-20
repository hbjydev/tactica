import { User } from './auth';

export type Unit = {
    id: string;
    slug: string;
    display_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
};

export type Rank = {
    id: string;
    unit_id: string;
    display_name: string;
    abbreviation: string;
    description?: string;
    ord: number;
    created_at: string;
    updated_at: string;

    unit?: Unit;
};

export type UnitMember = {
    id: string;
    display_name: string;
    rank_id: string;
    rank_changed_at: string;
    unit_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;

    status: 'active' | 'reserve' | 'loa' | 'discharged';
    status_changed_at: string;

    rank?: Rank;
    user?: User;
    unit?: Unit;
};

export type Paginated<T> = {
    current_page: number;
    data: T[];
    last_page: number;
    total: number;
};
