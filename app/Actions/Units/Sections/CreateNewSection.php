<?php

namespace App\Actions\Units\Sections;

use App\Concerns\SectionValidationRules;
use App\Models\Section;
use App\Models\Unit;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

class CreateNewSection
{
    use SectionValidationRules;

    /**
     * Create a new section with the given input data.
     */
    public function create(Unit $unit, array $input): Section
    {
        if ($input['parent_id'] === "null") $input['parent_id'] = null;

        $validated = Validator::make(
            $input,
            $this->sectionRules($unit->id),
        )->validate();

        /** @var \Illuminate\Http\UploadedFile|null $avatar */
        $avatar = clone($validated['avatar']);
        if ($avatar !== null) {
            unset($validated['avatar']);
        } else {
            $validated['avatar_id'] = null;
        }

        /** @var Section $section */
        $section = Section::create([
            ...$validated,
            'unit_id' => $unit->id,
        ]);

        $section->save();

        if ($avatar) {
            $section->addMedia($avatar)->toMediaCollection('avatar');
        }

        return $section;
    }
}
