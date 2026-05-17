<?php

namespace App\Observers;

use App\Models\Enums\ServiceRecordEntryType;
use App\Models\ServiceRecord;
use App\Models\UnitMember;

class UnitMemberObserver
{
    public function updating(UnitMember $member)
    {
        if ($member->isDirty('rank_id')) {
            $member->rank_changed_at = now();

            ServiceRecord::create([
                'unit_member_id' => $member->id,
                'performed_by' => auth()->guard()->user()->id,
                'type' => ServiceRecordEntryType::Promotion,
                'data' => [
                    'rank_id' => $member->rank_id,
                ]
            ]);
        }

        if ($member->isDirty('status')) {
            $member->status_changed_at = now();
        }
    }
}
