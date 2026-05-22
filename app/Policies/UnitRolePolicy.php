<?php

namespace App\Policies;

use App\Models\Enums\UnitPermission;
use App\Models\UnitRole;
use App\Models\User;

class UnitRolePolicy
{
    public function viewAny(?User $user): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    public function view(?User $user, UnitRole $role): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    public function create(User $user): bool
    {
        return can(UnitPermission::MANAGE_ROLES);
    }

    public function update(User $user, UnitRole $role): bool
    {
        return can(UnitPermission::MANAGE_ROLES);
    }

    public function delete(User $user, UnitRole $role): bool
    {
        return can(UnitPermission::MANAGE_ROLES);
    }

    public function manageMembers(User $user, UnitRole $role): bool
    {
        return can(UnitPermission::MANAGE_ROLES);
    }
}
