<?php

namespace App\Actions\Units\Members;

use App\Concerns\UnitMemberValidationRules;
use App\Models\UnitMember;
use Illuminate\Support\Facades\Validator;

class UpdateUnitMember
{
    use UnitMemberValidationRules;

    /**
     * Update a unit member's profile with the given input data.
     */
    public function update(UnitMember $member, array $input): void
    {
        Validator::make($input, $this->unitMemberRules($member->unit_id))->validate();

        $member->fill($input);
        $member->save();
    }
}
