<?php

namespace App\Actions\Units;

use App\Models\Enums\UnitMemberStatus;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreateNewUnit
{
    /**
     * Create a new unit with a given owner.
     */
    public function create(User $owner, array $input): Unit
    {
        Validator::make($input, [
            'slug' => ['required', 'string', 'max:16', 'unique:units,slug'],
            'display_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ])->validate();

        DB::beginTransaction();

        try {
            $unit = Unit::create([
                'slug' => $input['slug'],
                'display_name' => $input['display_name'],
                'description' => $input['description'] ?? null,
            ]);

            $captain = Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Captain',
                'abbreviation' => 'Cpt.',
            ]);

            Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Sergeant',
                'abbreviation' => 'Sgt.',
            ]);

            Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Private',
                'abbreviation' => 'Pvt.',
            ]);

            UnitMember::create([
                'unit_id' => $unit->id,
                'user_id' => $owner->id,
                'display_name' => $owner->display_name,
                'rank_id' => $captain->id,
                'rank_changed_at' => now('UTC'),
                'status' => UnitMemberStatus::Active,
                'status_changed_at' => now('UTC'),
            ]);

            DB::commit();

            return $unit;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
