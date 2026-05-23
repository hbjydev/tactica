<?php

namespace App\Actions\Units\Sections;

use App\Concerns\SectionValidationRules;
use App\Models\Section;
use Illuminate\Support\Facades\Validator;

class UpdateSection
{
    use SectionValidationRules;

    /**
     * Update a section's info with the given input data.
     */
    public function update(Section $section, array $input): void
    {
        if ($input['parent_id'] === "null") $input['parent_id'] = null;

        $validated = Validator::make(
            $input,
            $this->sectionRules($section->unit_id),
        )->validate();

        $section->fill($validated);
        $section->save();
    }
}
