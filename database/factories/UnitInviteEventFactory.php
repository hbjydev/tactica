<?php

namespace Database\Factories;

use App\Models\Enums\UnitInviteEventType;
use App\Models\UnitInvite;
use App\Models\UnitInviteEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnitInviteEvent>
 */
class UnitInviteEventFactory extends Factory
{
    protected $model = UnitInviteEvent::class;

    public function definition(): array
    {
        return [
            'unit_invite_id' => UnitInvite::factory(),
            'event_type' => UnitInviteEventType::VIEWED,
            'user_id' => null,
            'ip_hash' => null,
            'user_agent' => null,
            'referer' => null,
        ];
    }
}
