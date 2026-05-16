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
    created_at: string;
    updated_at: string;
};
