<?php

namespace App\Actions\Units\Slots;

use App\Models\Slot;

class DeleteSlot
{
    /**
     * Update a unit member's profile with the given input data.
     */
    public function delete(Slot $slot): void
    {
        $slot->delete();
    }
}
