<?php

use App\Actions\Units\Members\CreateNewUnitMember;
use App\Models\Enums\UnitMemberStatus;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use Illuminate\Validation\ValidationException;

describe('CreateNewUnitMember', function () {
    it('creates a member linked to a user', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $user = User::factory()->create();

        $member = (new CreateNewUnitMember)->create($unit, $user, [
            'display_name' => 'John Doe',
            'rank_id' => $rank->id,
            'status' => 'active',
        ]);

        expect($member)->toBeInstanceOf(UnitMember::class)
            ->and($member->unit_id)->toBe($unit->id)
            ->and($member->user_id)->toBe($user->id)
            ->and($member->display_name)->toBe('John Doe')
            ->and($member->status)->toBe(UnitMemberStatus::Active);
    });

    it('creates a user-less member when user is null', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        $member = (new CreateNewUnitMember)->create($unit, null, [
            'display_name' => 'Jane Doe',
            'rank_id' => $rank->id,
            'status' => 'active',
        ]);

        expect($member)->toBeInstanceOf(UnitMember::class)
            ->and($member->user_id)->toBeNull()
            ->and($member->display_name)->toBe('Jane Doe');
    });

    it('persists the member to the database', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        $member = (new CreateNewUnitMember)->create($unit, null, [
            'display_name' => 'Test Member',
            'rank_id' => $rank->id,
            'status' => 'active',
        ]);

        $this->assertDatabaseHas('unit_members', [
            'id' => $member->id,
            'unit_id' => $unit->id,
            'user_id' => null,
            'display_name' => 'Test Member',
            'status' => 'active',
        ]);
    });

    it('sets rank_changed_at and status_changed_at on create', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        $member = (new CreateNewUnitMember)->create($unit, null, [
            'display_name' => 'Test Member',
            'rank_id' => $rank->id,
            'status' => 'active',
        ]);

        expect($member->rank_changed_at)->not->toBeNull()
            ->and($member->status_changed_at)->not->toBeNull();
    });

    it('fails validation when display_name is missing', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new CreateNewUnitMember)->create($unit, null, [
            'rank_id' => $rank->id,
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when rank_id belongs to a different unit', function () {
        $unit = Unit::factory()->create();
        $otherUnit = Unit::factory()->create();
        $otherRank = Rank::factory()->for($otherUnit)->create(['abbreviation' => 'Cpl', 'ord' => 0]);

        expect(fn () => (new CreateNewUnitMember)->create($unit, null, [
            'display_name' => 'Test Member',
            'rank_id' => $otherRank->id,
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when status is invalid', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new CreateNewUnitMember)->create($unit, null, [
            'display_name' => 'Test Member',
            'rank_id' => $rank->id,
            'status' => 'bogus',
        ]))->toThrow(ValidationException::class);
    });
});
