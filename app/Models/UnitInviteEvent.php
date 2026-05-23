<?php

namespace App\Models;

use App\Models\Enums\UnitInviteEventType;
use Carbon\CarbonInterface;
use Database\Factories\UnitInviteEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $unit_invite_id
 * @property UnitInviteEventType $event_type
 * @property string|null $user_id
 * @property string|null $ip_hash
 * @property string|null $user_agent
 * @property string|null $referer
 * @property CarbonInterface $created_at
 */
#[Fillable([
    'unit_invite_id',
    'event_type',
    'user_id',
    'ip_hash',
    'user_agent',
    'referer',
])]
class UnitInviteEvent extends Model
{
    /** @use HasFactory<UnitInviteEventFactory> */
    use HasFactory, HasUlids;

    public const UPDATED_AT = null;

    protected $casts = [
        'event_type' => UnitInviteEventType::class,
        'created_at' => 'datetime',
    ];

    public function invite(): BelongsTo
    {
        return $this->belongsTo(UnitInvite::class, 'unit_invite_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
