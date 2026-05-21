<?php

namespace App\Actions\Units\Members;

use App\Concerns\UnitMemberValidationRules;
use App\Models\Enums\UnitPermission;
use App\Models\UnitMember;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\UnauthorizedException;

class UpdateUnitMember
{
    use UnitMemberValidationRules;

    /**
     * Update a unit member's profile with the given input data.
     */
    public function update(UnitMember $member, array $input): void
    {
        $validated = Validator::make(
            $input,
            $this->unitMemberRules($member->unit_id),
        )->validate();

        if ($member->rank_id != $validated['rank_id']) {
            can(UnitPermission::MANAGE_MEMBERS)
                || throw new UnauthorizedException(
                    'You do not have permission to change this member\'s rank.',
                );
        }

        $member->fill($validated);
        $member->save();
    }
}
