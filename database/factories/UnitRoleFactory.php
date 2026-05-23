<?php

namespace Database\Factories;

use App\Models\Unit;
use App\Models\UnitRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnitRole>
 */
class UnitRoleFactory extends Factory
{
    protected $model = UnitRole::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_id' => Unit::factory(),
            'display_name' => fake()->jobTitle(),
            'description' => fake()->optional()->sentence(),
            'permissions' => 0,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function withPermissions(int $permissions): static
    {
        return $this->state(fn (array $attributes) => [
            'permissions' => $permissions,
        ]);
    }
}
