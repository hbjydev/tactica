<?php

namespace App\Actions\Units\Slots;

use App\Concerns\SlotValidationRules;
use App\Models\Section;
use App\Models\Slot;
use Illuminate\Support\Facades\Validator;

class UpdateSlot
{
    use SlotValidationRules;

    /**
     * Update a slot's info with the given input data.
     */
    public function update(Section $section, Slot $slot, array $input): void
    {
        if (($input['unit_member_id'] ?? null) === 'null') $input['unit_member_id'] = null;

        $validated = Validator::make(
            $input,
            $this->slotRules($section->unit_id),
        )->validate();

        $slot->fill($validated);
        $slot->save();
    }
}
