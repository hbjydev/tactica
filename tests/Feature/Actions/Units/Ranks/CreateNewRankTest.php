<?php

use App\Actions\Units\Ranks\CreateNewRank;
use App\Models\Rank;
use App\Models\Unit;
use Illuminate\Validation\ValidationException;

describe('CreateNewRank', function () {
    it('creates a rank for a unit', function () {
        $unit = Unit::factory()->create();

        (new CreateNewRank)->create($unit, [
            'display_name' => 'Private',
            'abbreviation' => 'Pvt',
            'ord' => 0,
        ]);

        $this->assertDatabaseHas('ranks', [
            'unit_id' => $unit->id,
            'display_name' => 'Private',
            'abbreviation' => 'Pvt',
        ]);
    });

    it('returns the created rank model', function () {
        $unit = Unit::factory()->create();

        $rank = (new CreateNewRank)->create($unit, [
            'display_name' => 'Corporal',
            'abbreviation' => 'Cpl',
            'ord' => 0,
        ]);

        expect($rank)->toBeInstanceOf(Rank::class)
            ->and($rank->exists)->toBeTrue();
    });

    it('scopes the rank to the given unit', function () {
        $unit = Unit::factory()->create();

        $rank = (new CreateNewRank)->create($unit, [
            'display_name' => 'Sergeant',
            'abbreviation' => 'Sgt',
            'ord' => 0,
        ]);

        expect($rank->unit_id)->toBe($unit->id);
    });

    it('fails validation when display_name is missing', function () {
        $unit = Unit::factory()->create();

        expect(fn () => (new CreateNewRank)->create($unit, [
            'abbreviation' => 'Pvt',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation is missing', function () {
        $unit = Unit::factory()->create();

        expect(fn () => (new CreateNewRank)->create($unit, [
            'display_name' => 'Private',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when display_name exceeds 255 characters', function () {
        $unit = Unit::factory()->create();

        expect(fn () => (new CreateNewRank)->create($unit, [
            'display_name' => str_repeat('a', 256),
            'abbreviation' => 'Pvt',
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation exceeds 16 characters', function () {
        $unit = Unit::factory()->create();

        expect(fn () => (new CreateNewRank)->create($unit, [
            'display_name' => 'Private',
            'abbreviation' => str_repeat('a', 17),
        ]))->toThrow(ValidationException::class);
    });

    it('fails validation when abbreviation is already taken', function () {
        $unit = Unit::factory()->create();

        Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt']);

        expect(fn () => (new CreateNewRank)->create($unit, [
            'display_name' => 'Private First Class',
            'abbreviation' => 'Pvt',
        ]))->toThrow(ValidationException::class);
    });

    it('accepts an abbreviation that is exactly 16 characters', function () {
        $unit = Unit::factory()->create();

        $rank = (new CreateNewRank)->create($unit, [
            'display_name' => 'Some Long Rank',
            'abbreviation' => str_repeat('a', 16),
            'ord' => 0,
        ]);

        expect($rank->abbreviation)->toHaveLength(16);
    });
});
