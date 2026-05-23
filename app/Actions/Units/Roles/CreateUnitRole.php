<?php

namespace App\Actions\Units\Roles;

use App\Models\Enums\UnitRoleType;
use App\Models\Unit;
use App\Models\UnitRole;
use Illuminate\Support\Facades\Validator;

class CreateUnitRole
{
    /**
     * Create a new custom role for the given unit.
     */
    public function create(Unit $unit, array $input): UnitRole
    {
        Validator::make($input, [
            'display_name' => ['required', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:255'],
        ])->validate();

        return UnitRole::create([
            'unit_id' => $unit->id,
            'display_name' => $input['display_name'],
            'description' => $input['description'] ?? null,
            'permissions' => 0,
            'type' => UnitRoleType::CUSTOM,
        ]);
    }
}
