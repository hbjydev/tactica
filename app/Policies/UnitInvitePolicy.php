<?php

namespace App\Policies;

use App\Models\Enums\UnitPermission;
use App\Models\UnitInvite;
use App\Models\User;

class UnitInvitePolicy
{
    public function viewAny(?User $user): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }

    public function view(?User $user, UnitInvite $invite): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }

    public function create(User $user): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }

    public function update(User $user, UnitInvite $invite): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }

    public function revoke(User $user, UnitInvite $invite): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }

    public function delete(User $user, UnitInvite $invite): bool
    {
        return can(UnitPermission::MANAGE_INVITES);
    }
}
