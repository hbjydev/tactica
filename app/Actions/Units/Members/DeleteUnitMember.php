<?php

namespace App\Actions\Units\Members;

use App\Concerns\UnitMemberValidationRules;
use App\Models\UnitMember;

class DeleteUnitMember
{
    use UnitMemberValidationRules;

    /**
     * Update a unit member's profile with the given input data.
     */
    public function delete(UnitMember $member): void
    {
        $member->delete();
    }
}
