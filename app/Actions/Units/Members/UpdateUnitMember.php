<?php

namespace App\Actions\Units\Members;

use App\Models\Enums\UnitMemberStatus;
use App\Models\UnitMember;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UpdateUnitMember
{
    /**
     * Update a unit member's profile with the given input data.
     */
    public function update(UnitMember $member, array $input): void
    {
        Validator::make($input, [
            'display_name' => ['required', 'string', 'max:255'],
            'rank_id' => [
                'required',
                'string',
                Rule::exists('ranks', 'id')->where('unit_id', $member->unit_id),
            ],
            'status' => ['required', Rule::enum(UnitMemberStatus::class)],
        ])->validate();

        $member->fill($input);
        $member->save();
    }
}
