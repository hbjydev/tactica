<?php

namespace App\Policies;

use App\Models\Enums\UnitPermission;
use App\Models\Rank;
use App\Models\User;

class RankPolicy
{
    public function viewAny(?User $user): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    public function view(?User $user, Rank $rank): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    public function create(User $user): bool
    {
        return can(UnitPermission::MANAGE_RANKS);
    }

    public function update(User $user, Rank $rank): bool
    {
        return can(UnitPermission::MANAGE_RANKS);
    }

    public function destroy(User $user, Rank $rank): bool
    {
        return can(UnitPermission::MANAGE_RANKS);
    }
}
