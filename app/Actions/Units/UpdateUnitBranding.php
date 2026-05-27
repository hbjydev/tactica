<?php

namespace App\Actions\Units;

use App\Models\Unit;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

class UpdateUnitBranding
{
    /**
     * Create a new unit with a given owner.
     */
    public function update(Unit $unit, array $input): void
    {
        if (($input['avatar'] ?? null) === 'null') {
            $input['avatar'] = null;
        }

        // Capture intent before validation; absent key = don't touch media.
        $avatarPresent = array_key_exists('avatar', $input);

        $validated = Validator::make($input, [
            'display_name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:12288'], // max 12mb
            'description' => ['nullable', 'string'],
        ])->validate();

        /** @var UploadedFile|null $avatar */
        $avatar = $validated['avatar'] ?? null;
        unset($validated['avatar']);

        $unit->fill($validated);
        $unit->save();

        if ($avatar) {
            $unit->clearMediaCollection('avatar');
            $unit->addMedia($avatar)->toMediaCollection('avatar');
        } elseif ($avatarPresent) {
            $unit->clearMediaCollection('avatar');
        }
    }
}
