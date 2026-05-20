<?php

use App\Actions\Units\Ranks\DeleteRank;
use App\Actions\Units\Ranks\RankNotEmptyException;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;

describe('DeleteRank', function () {
    it('deletes a rank with no members', function () {
        $rank = Rank::factory()->create();

        (new DeleteRank)->delete($rank);

        $this->assertModelMissing($rank);
    });

    it('throws when rank has members assigned', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create();

        UnitMember::factory()->for($unit)->for($rank)->create();

        expect(fn () => (new DeleteRank)->delete($rank))
            ->toThrow(RankNotEmptyException::class);
    });

    it('does not delete the rank when it has members', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create();

        UnitMember::factory()->for($unit)->for($rank)->create();

        try {
            (new DeleteRank)->delete($rank);
        } catch (RankNotEmptyException) {
            // expected
        }

        $this->assertModelExists($rank);
    });

    it('throws with the correct message when rank has members', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create();

        UnitMember::factory()->for($unit)->for($rank)->create();

        expect(fn () => (new DeleteRank)->delete($rank))
            ->toThrow(RankNotEmptyException::class, 'Cannot delete a rank that has members assigned to it.');
    });

    it('allows deletion after all members are removed', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create();
        $member = UnitMember::factory()->for($unit)->for($rank)->create();

        $member->delete();

        (new DeleteRank)->delete($rank->fresh());

        $this->assertModelMissing($rank);
    });
});
