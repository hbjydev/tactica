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
     * Update a unit member's profile with the given input data.
     */
    public function create(Unit $unit, User $user, array $input): UnitMember
    {
        $validated = Validator::make(
            $input,
            $this->unitMemberRules($unit->id),
        )->validate();

        /** @var UnitMember $member */
        $member = UnitMember::create([
            'unit_id' => $unit->id,
            'user_id' => $user->id,
            ...$validated,
        ]);

        $member->save();

        return $member;
    }
}
