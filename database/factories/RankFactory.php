<?php

namespace Database\Factories;

use App\Models\Rank;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rank>
 */
class RankFactory extends Factory
{
    protected $model = Rank::class;

    public function definition(): array
    {
        return [
            'unit_id' => Unit::factory(),
            'display_name' => fake()->jobTitle(),
            'abbreviation' => strtoupper(fake()->lexify('???')),
            'description' => fake()->optional()->sentence(),
            'ord' => fake()->unique()->numberBetween(0, 999),
        ];
    }
}
