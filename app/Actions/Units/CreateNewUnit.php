<?php

namespace App\Actions\Units;

use App\Actions\Units\Members\CreateNewUnitMember;
use App\Actions\Units\Ranks\CreateNewRank;
use App\Models\Enums\UnitMemberStatus;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CreateNewUnit
{
    public function __construct(
        private CreateNewRank $newRankAction,
        private CreateNewUnitMember $newMemberAction,
    ) {}

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
            /** @var Unit $unit */
            $unit = Unit::create([
                'slug' => $input['slug'],
                'display_name' => $input['display_name'],
                'description' => $input['description'] ?? null,
            ]);

            $captain = $this->newRankAction->create($unit, [
                'display_name' => 'Captain',
                'abbreviation' => 'Cpt.',
                'ord' => 2,
            ]);

            $this->newRankAction->create($unit, [
                'display_name' => 'Sergeant',
                'abbreviation' => 'Sgt.',
                'ord' => 1,
            ]);

            $this->newRankAction->create($unit, [
                'display_name' => 'Private',
                'abbreviation' => 'Pvt.',
                'ord' => 0,
            ]);

            ['admin' => $role] = $unit->createDefaultRoles();

            $member = $this->newMemberAction->create($unit, $owner, [
                'display_name' => $owner->display_name,

                'rank_id' => $captain->id,
                'rank_changed_at' => now('UTC'),

                'status' => UnitMemberStatus::Active,
                'status_changed_at' => now('UTC'),
            ]);

            $member->roleBindings()->create([
                'unit_role_id' => $role->id,
            ]);

            DB::commit();

            return $unit;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
