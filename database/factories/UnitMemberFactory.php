<?php

namespace Database\Factories;

use App\Models\Enums\UnitMemberStatus;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnitMember>
 */
class UnitMemberFactory extends Factory
{
    protected $model = UnitMember::class;

    public function definition(): array
    {
        $unit = Unit::factory()->create();

        return [
            'unit_id' => $unit->id,
            'user_id' => User::factory(),
            'rank_id' => Rank::factory()->for($unit),
            'display_name' => fake()->name(),
            'status' => fake()->randomElement(UnitMemberStatus::cases())->value,
            'status_changed_at' => now(),
            'rank_changed_at' => now(),
        ];
    }
}
