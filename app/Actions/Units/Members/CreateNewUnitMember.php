<?php

namespace App\Actions\Units\Members;

use App\Concerns\UnitMemberValidationRules;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class CreateNewUnitMember
{
    use UnitMemberValidationRules;

    /**
     * Create a new unit member, optionally linked to a user account.
     * Pass null for $user to create a user-less (placeholder) member.
     */
    public function create(Unit $unit, ?User $user, array $input): UnitMember
    {
        $validated = Validator::make(
            $input,
            $this->unitMemberRules($unit->id),
        )->validate();

        /** @var UnitMember $member */
        $member = UnitMember::create([
            ...$validated,
            'unit_id' => $unit->id,
            'user_id' => $user?->id,
            'rank_changed_at' => now(),
            'status_changed_at' => now(),
        ]);

        $member->save();

        return $member;
    }
}
