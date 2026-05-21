<?php

namespace App\Concerns;

use App\Models\Enums\UnitMemberStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait UnitMemberValidationRules
{
    /**
     * Get the validation rules used to validate unit member profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function unitMemberRules(string $unitId): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'rank_id' => [
                'required',
                'string',
                Rule::exists('ranks', 'id')->where('unit_id', $unitId),
            ],
            'status' => ['required', Rule::enum(UnitMemberStatus::class)],
        ];
    }
}
