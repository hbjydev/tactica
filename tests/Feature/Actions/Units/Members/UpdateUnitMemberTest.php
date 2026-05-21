<?php

use App\Actions\Units\Members\UpdateUnitMember;
use App\Models\Enums\UnitMemberStatus;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use Illuminate\Validation\ValidationException;

describe('UpdateUnitMember', function () {
    it('updates the display_name of a member', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['display_name' => 'John Doe', 'status' => UnitMemberStatus::Active]);

        (new UpdateUnitMember)->update($member, [
            'display_name' => 'Jane Doe',
            'rank_id' => $rank->id,
            'status' => 'active',
        ]);

        expect($member->fresh()->display_name)->toBe('Jane Doe');
    });

    it('updates the rank of a member', function () {
        $unit = Unit::factory()->create();
        $rankA = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $rankB = Rank::factory()->for($unit)->create(['abbreviation' => 'Cpl', 'ord' => 1]);
        $member = UnitMember::factory()->for($unit)->for($rankA)->create(['status' => UnitMemberStatus::Active]);

        $this->actingAs(User::factory()->create());

        (new UpdateUnitMember)->update($member, [
            'display_name' => $member->display_name,
            'rank_id' => $rankB->id,
            'status' => 'active',
        ]);

        expect($member->fresh()->rank_id)->toBe($rankB->id);
    });

    it('updates the status of a member', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        (new UpdateUnitMember)->update($member, [
            'display_name' => $member->display_name,
            'rank_id' => $rank->id,
            'status' => 'reserve',
        ]);

        expect($member->fresh()->status)->toBe(UnitMemberStatus::Reserve);
    });

    it('persists changes to the database', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['display_name' => 'John Doe', 'status' => UnitMemberStatus::Active]);

        (new UpdateUnitMember)->update($member, [
            'display_name' => 'Updated Name',
            'rank_id' => $rank->id,
            'status' => 'loa',
        ]);

        $this->assertDatabaseHas('unit_members', [
            'id' => $member->id,
            'display_name' => 'Updated Name',
            'status' => 'loa',
        ]);
    });

    it('fails validation when display_name is missing', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'rank_id' => $rank->id,
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when display_name exceeds 255 characters', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'display_name' => str_repeat('a', 256),
            'rank_id' => $rank->id,
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when rank_id is missing', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'display_name' => 'John Doe',
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when rank_id does not exist in the unit', function () {
        $unit = Unit::factory()->create();
        $otherUnit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $otherRank = Rank::factory()->for($otherUnit)->create(['abbreviation' => 'Cpl', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'display_name' => 'John Doe',
            'rank_id' => $otherRank->id,
            'status' => 'active',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when status is missing', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'display_name' => 'John Doe',
            'rank_id' => $rank->id,
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when status is invalid', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
        $member = UnitMember::factory()->for($unit)->for($rank)->create(['status' => UnitMemberStatus::Active]);

        expect(fn () => (new UpdateUnitMember)->update($member, [
            'display_name' => 'John Doe',
            'rank_id' => $rank->id,
            'status' => 'invalid_status',
        ]))->toThrow(ValidationException::class);
    });
});
