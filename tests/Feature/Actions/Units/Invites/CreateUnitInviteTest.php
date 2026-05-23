<?php

use App\Actions\Units\Invites\CreateUnitInvite;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitInvite;
use Illuminate\Validation\ValidationException;

describe('CreateUnitInvite', function () {
    it('creates an invite with sane defaults', function () {
        $unit = Unit::factory()->create();

        $invite = app(CreateUnitInvite::class)->create($unit, null, [
            'notes' => 'Discord recruitment',
        ]);

        expect($invite)->toBeInstanceOf(UnitInvite::class)
            ->and($invite->unit_id)->toBe($unit->id)
            ->and($invite->notes)->toBe('Discord recruitment')
            ->and($invite->token)->toHaveLength(40)
            ->and($invite->uses)->toBe(0)
            ->and($invite->views)->toBe(0);
    });

    it('persists optional fields when supplied', function () {
        $unit = Unit::factory()->create();
        $rank = Rank::factory()->for($unit)->create(['ord' => 0]);

        $invite = app(CreateUnitInvite::class)->create($unit, null, [
            'notes' => null,
            'expires_at' => now()->addDays(3)->toIso8601String(),
            'max_uses' => 5,
            'default_rank_id' => $rank->id,
        ]);

        expect($invite->max_uses)->toBe(5)
            ->and($invite->default_rank_id)->toBe($rank->id)
            ->and($invite->expires_at)->not->toBeNull();
    });

    it('rejects past expiry dates', function () {
        $unit = Unit::factory()->create();

        expect(fn () => app(CreateUnitInvite::class)->create($unit, null, [
            'expires_at' => now()->subDay()->toIso8601String(),
        ]))->toThrow(ValidationException::class);
    });

    it('rejects max_uses below 1', function () {
        $unit = Unit::factory()->create();

        expect(fn () => app(CreateUnitInvite::class)->create($unit, null, [
            'max_uses' => 0,
        ]))->toThrow(ValidationException::class);
    });

    it('rejects a default_rank_id that belongs to a different unit', function () {
        $unitA = Unit::factory()->create();
        $unitB = Unit::factory()->create();
        $foreignRank = Rank::factory()->for($unitB)->create(['ord' => 0]);

        expect(fn () => app(CreateUnitInvite::class)->create($unitA, null, [
            'default_rank_id' => $foreignRank->id,
        ]))->toThrow(ValidationException::class);
    });

    it('generates unique tokens', function () {
        $unit = Unit::factory()->create();

        $a = app(CreateUnitInvite::class)->create($unit, null, []);
        $b = app(CreateUnitInvite::class)->create($unit, null, []);

        expect($a->token)->not->toBe($b->token);
    });
});
