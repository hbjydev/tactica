<?php

namespace App\Actions\Units\Slots;

use App\Concerns\SlotValidationRules;
use App\Models\Section;
use App\Models\Slot;
use Illuminate\Support\Facades\Validator;

class CreateNewSlot
{
    use SlotValidationRules;

    /**
     * Create a new section with the given input data.
     */
    public function create(Section $section, array $input): Slot
    {
        if ($input['unit_member_id'] === "null") {
            $input['unit_member_id'] = null;
        }

        $validated = Validator::make(
            $input,
            $this->slotRules($section->unit->id),
        )->validate();

        /** @var Slot $slot */
        $slot = Slot::create([
            ...$validated,
            'section_id' => $section->id,
        ]);

        $slot->save();

        return $slot;
    }
}
