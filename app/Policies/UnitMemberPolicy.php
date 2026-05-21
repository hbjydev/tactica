<?php

namespace App\Policies;

use App\Models\UnitMember;
use App\Models\User;

class UnitMemberPolicy
{
    public function show(): bool
    {
        // Members are public
        return true;
    }

    public function update(User $user, UnitMember $member): bool
    {
        return $this->isSelf($user, $member) || $this->isUnitMember($user, $member);
    }

    public function destroy(User $user, UnitMember $member): bool
    {
        return $this->isSelf($user, $member);
    }

    protected function isUnitMember(User $user, UnitMember $member): bool
    {
        return $user->units()->where('units.id', $member->unit->id)->exists();
    }

    protected function isSelf(User $user, UnitMember $member): bool
    {
        return $member->user_id === $user->id;
    }
}
