<?php

namespace App\Policies;

use App\Models\Enums\UnitPermission;
use App\Models\UnitMember;
use App\Models\User;

class UnitMemberPolicy
{
    public function viewAny(?User $user): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    public function create(User $user): bool
    {
        return can(UnitPermission::MANAGE_MEMBERS);
    }

    public function view(?User $user, UnitMember $member): bool
    {
        return $this->isSelf($user, $member) || can(UnitPermission::VIEW_UNIT);
    }

    public function update(User $user, UnitMember $member): bool
    {
        return $this->isSelf($user, $member) || can(UnitPermission::MANAGE_MEMBERS);
    }

    public function changeRank(User $user, UnitMember $member): bool
    {
        return can(UnitPermission::MANAGE_MEMBERS);
    }

    public function destroy(User $user, UnitMember $member): bool
    {
        return $this->isSelf($user, $member) || can(UnitPermission::MANAGE_MEMBERS);
    }

    protected function isSelf(?User $user, UnitMember $member): bool
    {
        if ($user === null) {
            return false;
        }

        return $user->member?->id == $member->id;
    }
}
