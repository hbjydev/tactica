<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait SectionValidationRules
{
    /**
     * Get the validation rules used to validate unit member profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function sectionRules(string $unitId): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'ord' => ['required', 'integer'],
            'callsign' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:512'],
            'parent_id' => [
                'nullable',
                'string',
                Rule::exists('sections', 'id')->where('unit_id', $unitId),
            ],
        ];
    }
}
