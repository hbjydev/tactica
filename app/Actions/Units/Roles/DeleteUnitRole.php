<?php

namespace App\Actions\Units\Roles;

use App\Models\UnitRole;

class DeleteUnitRole
{
    /**
     * Delete a unit role and its associated bindings.
     */
    public function delete(UnitRole $role): void
    {
        $role->bindings()->delete();
        $role->delete();
    }
}
