<?php

namespace Database\Factories;

use App\Models\Unit;
use App\Models\UnitInvite;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<UnitInvite>
 */
class UnitInviteFactory extends Factory
{
    protected $model = UnitInvite::class;

    public function definition(): array
    {
        return [
            'unit_id' => Unit::factory(),
            'token' => Str::random(40),
            'expires_at' => now()->addDays(7),
            'max_uses' => null,
            'uses' => 0,
            'views' => 0,
            'revoked_at' => null,
            'notes' => null,
        ];
    }

    public function expired(): static
    {
        return $this->state(fn () => ['expires_at' => now()->subDay()]);
    }

    public function revoked(): static
    {
        return $this->state(fn () => ['revoked_at' => now()]);
    }

    public function exhausted(int $cap = 1): static
    {
        return $this->state(fn () => ['max_uses' => $cap, 'uses' => $cap]);
    }
}
