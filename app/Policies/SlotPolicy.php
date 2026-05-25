<?php

namespace App\Policies;

use App\Models\Enums\UnitPermission;
use App\Models\Slot;
use App\Models\User;

class SlotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Slot $slot): bool
    {
        return can(UnitPermission::VIEW_UNIT);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return can(UnitPermission::MANAGE_SECTIONS);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Slot $slot): bool
    {
        return can(UnitPermission::MANAGE_SECTIONS);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function destroy(User $user, Slot $slot): bool
    {
        return can(UnitPermission::MANAGE_SECTIONS);
    }
}
