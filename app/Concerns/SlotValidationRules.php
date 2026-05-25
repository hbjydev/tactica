<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait SlotValidationRules
{
    /**
     * Get the validation rules used to validate unit member profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function slotRules(string $unitId): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'is_leader' => ['boolean'], // max 12mb
            'callsign' => ['nullable', 'string', 'max:255'],
            'ord' => ['required', 'integer'],
            'unit_member_id' => [
                'nullable',
                'string',
                Rule::exists('unit_members', 'id')->where('unit_id', $unitId),
            ],
        ];
    }
}
