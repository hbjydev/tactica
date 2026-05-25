<?php

namespace App\Actions\Units\Sections;

use App\Concerns\SectionValidationRules;
use App\Models\Section;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

class UpdateSection
{
    use SectionValidationRules;

    /**
     * Update a section's info with the given input data.
     */
    public function update(Section $section, array $input): void
    {
        if (($input['parent_id'] ?? null) === 'null') {
            $input['parent_id'] = null;
        }
        if (($input['avatar'] ?? null) === 'null') {
            $input['avatar'] = null;
        }

        // Capture intent before validation; absent key = don't touch media.
        $avatarPresent = array_key_exists('avatar', $input);

        $validated = Validator::make(
            $input,
            $this->sectionRules($section->unit_id),
        )->validate();

        /** @var UploadedFile|null $avatar */
        $avatar = $validated['avatar'] ?? null;
        unset($validated['avatar']);

        $section->fill($validated);
        $section->save();

        if ($avatar) {
            $section->clearMediaCollection('avatar');
            $section->addMedia($avatar)->toMediaCollection('avatar');
        } elseif ($avatarPresent) {
            $section->clearMediaCollection('avatar');
        }
    }
}
