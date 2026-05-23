<?php

namespace App\Actions\Units\Roles;

use App\Models\UnitRole;
use Illuminate\Support\Facades\Validator;

class UpdateUnitRole
{
    /**
     * Update an existing unit role's display name and description.
     */
    public function update(UnitRole $role, array $input): UnitRole
    {
        Validator::make($input, [
            'display_name' => ['required', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $role->update([
            'display_name' => $input['display_name'],
            'description' => $input['description'] ?? null,
        ]);

        return $role;
    }
}
