<?php

namespace App\Observers;

use App\Models\Enums\ServiceRecordEntryType;
use App\Models\ServiceRecord;
use App\Models\Slot;

class SlotObserver
{
    /**
     * Free a member from any other slot they're currently occupying (within
     * this unit) and record the unassignment quietly — no cascading observers.
     */
    private function evictFromCurrentSlot(string $memberId, string $exceptSlotId): void
    {
        $current = Slot::where('unit_member_id', $memberId)
            ->where('id', '!=', $exceptSlotId)
            ->first();

        if ($current) {
            $current->unit_member_id = null;
            $current->saveQuietly();
        }
    }

    /**
     * Write a ServiceRecord marking a member as assigned to a slot.
     */
    private function recordAssignment(Slot $slot, string $memberId): void
    {
        ServiceRecord::create([
            'unit_member_id' => $memberId,
            'performed_by' => auth()->guard()->user()->id,
            'type' => ServiceRecordEntryType::Assignment,
            'data' => [
                'section_id' => $slot->section_id,
                'slot_id' => $slot->id,
            ],
        ]);
    }

    /**
     * Write a ServiceRecord marking a member as unassigned (null slot).
     */
    private function recordUnassignment(string $memberId): void
    {
        ServiceRecord::create([
            'unit_member_id' => $memberId,
            'performed_by' => auth()->guard()->user()->id,
            'type' => ServiceRecordEntryType::Assignment,
            'data' => [
                'section_id' => null,
                'slot_id' => null,
            ],
        ]);
    }

    public function creating(Slot $slot): void
    {
        if (! $slot->unit_member_id) {
            return;
        }

        // Evict member from any existing slot before assigning them here
        $this->evictFromCurrentSlot($slot->unit_member_id, $slot->id);
        $this->recordAssignment($slot, $slot->unit_member_id);
    }

    public function updating(Slot $slot): void
    {
        $oldMemberId = $slot->getOriginal('unit_member_id');
        $newMemberId = $slot->unit_member_id;

        // Nothing changed — bail early
        if ($oldMemberId === $newMemberId) {
            return;
        }

        // Old member is being removed or replaced — null assignment for them
        if ($oldMemberId) {
            $this->recordUnassignment($oldMemberId);
        }

        // New member is being assigned to this slot
        if ($newMemberId) {
            // Free them from wherever they currently sit
            $this->evictFromCurrentSlot($newMemberId, $slot->id);
            $this->recordAssignment($slot, $newMemberId);
        }
    }
}
