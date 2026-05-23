<?php

namespace Database\Factories;

use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnitRoleBinding>
 */
class UnitRoleBindingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_role_id' => UnitRole::factory(),
            'unit_member_id' => UnitMember::factory(),
        ];
    }
}
