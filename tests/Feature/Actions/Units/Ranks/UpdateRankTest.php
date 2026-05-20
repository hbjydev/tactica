<?php

use App\Actions\Units\Ranks\UpdateRank;
use App\Models\Rank;
use App\Models\Unit;
use Illuminate\Validation\ValidationException;

describe('UpdateRank', function () {
    it('updates the display_name of a rank', function () {
        $rank = Rank::factory()->create(['display_name' => 'Private', 'abbreviation' => 'Pvt', 'ord' => 0]);

        (new UpdateRank)->update($rank, [
            'display_name' => 'Private First Class',
            'abbreviation' => 'PFC',
            'ord' => 0,
        ]);

        expect($rank->fresh()->display_name)->toBe('Private First Class');
    });

    it('updates the abbreviation of a rank', function () {
        $rank = Rank::factory()->create(['display_name' => 'Private', 'abbreviation' => 'Pvt', 'ord' => 0]);

        (new UpdateRank)->update($rank, [
            'display_name' => 'Private',
            'abbreviation' => 'Pvt2',
            'ord' => 0,
        ]);

        expect($rank->fresh()->abbreviation)->toBe('Pvt2');
    });

    it('persists changes to the database', function () {
        $rank = Rank::factory()->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        (new UpdateRank)->update($rank, [
            'display_name' => 'Updated Rank',
            'abbreviation' => 'Upd',
            'ord' => 0,
        ]);

        $this->assertDatabaseHas('ranks', [
            'id' => $rank->id,
            'display_name' => 'Updated Rank',
            'abbreviation' => 'Upd',
        ]);
    });

    it('fails validation when display_name is missing', function () {
        $rank = Rank::factory()->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new UpdateRank)->update($rank, [
            'abbreviation' => 'Cpl',
            'ord' => 0,
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation is missing', function () {
        $rank = Rank::factory()->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new UpdateRank)->update($rank, [
            'display_name' => 'Private',
            'ord' => 0,
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when display_name exceeds 255 characters', function () {
        $rank = Rank::factory()->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new UpdateRank)->update($rank, [
            'display_name' => str_repeat('a', 256),
            'abbreviation' => 'Cpl',
            'ord' => 0,
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation exceeds 16 characters', function () {
        $rank = Rank::factory()->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new UpdateRank)->update($rank, [
            'display_name' => 'Private',
            'abbreviation' => str_repeat('a', 17),
            'ord' => 0,
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation is already taken by another rank', function () {
        $unit = Unit::factory()->create();
        Rank::factory()->for($unit)->create(['abbreviation' => 'Sgt', 'ord' => 1]);
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        expect(fn () => (new UpdateRank)->update($rank, [
            'display_name' => 'Private',
            'abbreviation' => 'Sgt',
            'ord' => 0,
        ]))->toThrow(ValidationException::class);
    });

    describe('ord shifting', function () {
        it('shifts ranks up when moving a rank to a higher ord', function () {
            $unit = Unit::factory()->create();
            $rankA = Rank::factory()->for($unit)->create(['abbreviation' => 'A', 'ord' => 3]);
            $rankB = Rank::factory()->for($unit)->create(['abbreviation' => 'B', 'ord' => 2]);
            $rankC = Rank::factory()->for($unit)->create(['abbreviation' => 'C', 'ord' => 1]);
            $rankD = Rank::factory()->for($unit)->create(['abbreviation' => 'D', 'ord' => 0]);

            // Move D from ord:0 → ord:2
            (new UpdateRank)->update($rankD, [
                'display_name' => $rankD->display_name,
                'abbreviation' => 'D',
                'ord' => 2,
            ]);

            expect($rankA->fresh()->ord)->toBe(3); // unchanged
            expect($rankB->fresh()->ord)->toBe(1); // shifted down
            expect($rankC->fresh()->ord)->toBe(0); // shifted down
            expect($rankD->fresh()->ord)->toBe(2); // moved to target
        });

        it('shifts ranks down when moving a rank to a lower ord', function () {
            $unit = Unit::factory()->create();
            $rankA = Rank::factory()->for($unit)->create(['abbreviation' => 'A', 'ord' => 3]);
            $rankB = Rank::factory()->for($unit)->create(['abbreviation' => 'B', 'ord' => 2]);
            $rankC = Rank::factory()->for($unit)->create(['abbreviation' => 'C', 'ord' => 1]);
            $rankD = Rank::factory()->for($unit)->create(['abbreviation' => 'D', 'ord' => 0]);

            // Move A from ord:3 → ord:1
            (new UpdateRank)->update($rankA, [
                'display_name' => $rankA->display_name,
                'abbreviation' => 'A',
                'ord' => 1,
            ]);

            expect($rankA->fresh()->ord)->toBe(1); // moved to target
            expect($rankB->fresh()->ord)->toBe(3); // shifted up
            expect($rankC->fresh()->ord)->toBe(2); // shifted up
            expect($rankD->fresh()->ord)->toBe(0); // unchanged
        });

        it('does not affect ranks outside the shifted range', function () {
            $unit = Unit::factory()->create();
            $rankA = Rank::factory()->for($unit)->create(['abbreviation' => 'A', 'ord' => 3]);
            $rankB = Rank::factory()->for($unit)->create(['abbreviation' => 'B', 'ord' => 2]);
            $rankC = Rank::factory()->for($unit)->create(['abbreviation' => 'C', 'ord' => 1]);
            $rankD = Rank::factory()->for($unit)->create(['abbreviation' => 'D', 'ord' => 0]);

            // Move C from ord:1 → ord:2 — only B should shift
            (new UpdateRank)->update($rankC, [
                'display_name' => $rankC->display_name,
                'abbreviation' => 'C',
                'ord' => 2,
            ]);

            expect($rankA->fresh()->ord)->toBe(3); // untouched
            expect($rankB->fresh()->ord)->toBe(1); // shifted down into C's old slot
            expect($rankC->fresh()->ord)->toBe(2); // moved up
            expect($rankD->fresh()->ord)->toBe(0); // untouched
        });

        it('does not shift ranks in other units', function () {
            $unit1 = Unit::factory()->create();
            $unit2 = Unit::factory()->create();

            $rankInUnit1 = Rank::factory()->for($unit1)->create(['abbreviation' => 'A', 'ord' => 1]);
            $rankInUnit2 = Rank::factory()->for($unit2)->create(['abbreviation' => 'B', 'ord' => 1]);
            $movingRank = Rank::factory()->for($unit1)->create(['abbreviation' => 'C', 'ord' => 0]);

            // Move C in unit1 from ord:0 → ord:1
            (new UpdateRank)->update($movingRank, [
                'display_name' => $movingRank->display_name,
                'abbreviation' => 'C',
                'ord' => 1,
            ]);

            expect($rankInUnit2->fresh()->ord)->toBe(1); // completely unaffected
            expect($rankInUnit1->fresh()->ord)->toBe(0); // shifted down
            expect($movingRank->fresh()->ord)->toBe(1);  // moved to target
        });

        it('leaves ord unchanged when the same ord is provided', function () {
            $unit = Unit::factory()->create();
            $rankA = Rank::factory()->for($unit)->create(['abbreviation' => 'A', 'ord' => 1]);
            $rankB = Rank::factory()->for($unit)->create(['abbreviation' => 'B', 'ord' => 0]);

            (new UpdateRank)->update($rankB, [
                'display_name' => $rankB->display_name,
                'abbreviation' => 'B',
                'ord' => 0,
            ]);

            expect($rankA->fresh()->ord)->toBe(1); // untouched
            expect($rankB->fresh()->ord)->toBe(0); // no change
        });
    });
});
