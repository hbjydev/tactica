<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

trait RankValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function rankRules(string $unitId, ?string $rankId = null): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'abbreviation' => [
                'required',
                'string',
                'max:16',
                $this->scopedUnique($unitId, 'abbreviation', $rankId),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'ord' => [
                'required',
                'integer',
            ],
        ];
    }

    protected function scopedUnique(string $unitId, string $field, ?string $rankId = null): Unique
    {
        $rule = $rankId === null
            ? Rule::unique('ranks', $field)
            : Rule::unique('ranks', $field)->ignore($rankId, 'id');

        return $rule->where(fn (Builder $query) => $query->where('unit_id', $unitId));
    }
}
