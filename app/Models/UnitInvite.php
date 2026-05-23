<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Database\Factories\UnitInviteFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $unit_id
 * @property string $token
 * @property string|null $created_by_member_id
 * @property string|null $default_rank_id
 * @property CarbonInterface|null $expires_at
 * @property int|null $max_uses
 * @property int $uses
 * @property int $views
 * @property CarbonInterface|null $revoked_at
 * @property string|null $notes
 * @property string $status
 * @property string $accept_url
 */
#[Fillable([
    'unit_id',
    'token',
    'created_by_member_id',
    'default_rank_id',
    'expires_at',
    'max_uses',
    'notes',
])]
#[Appends(['status', 'accept_url'])]
class UnitInvite extends Model
{
    /** @use HasFactory<UnitInviteFactory> */
    use HasFactory, HasUlids;

    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function createdByMember(): BelongsTo
    {
        return $this->belongsTo(UnitMember::class, 'created_by_member_id');
    }

    public function defaultRank(): BelongsTo
    {
        return $this->belongsTo(Rank::class, 'default_rank_id');
    }

    public function defaultRoles(): BelongsToMany
    {
        return $this->belongsToMany(
            UnitRole::class,
            'unit_invite_default_roles',
            'unit_invite_id',
            'unit_role_id',
        )->withTimestamps();
    }

    public function events(): HasMany
    {
        return $this->hasMany(UnitInviteEvent::class);
    }

    public function isUsable(): bool
    {
        if ($this->revoked_at !== null) {
            return false;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses !== null && $this->uses >= $this->max_uses) {
            return false;
        }

        return true;
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            get: function (): string {
                if ($this->revoked_at !== null) {
                    return 'revoked';
                }

                if ($this->expires_at !== null && $this->expires_at->isPast()) {
                    return 'expired';
                }

                if ($this->max_uses !== null && $this->uses >= $this->max_uses) {
                    return 'exhausted';
                }

                return 'active';
            },
        );
    }

    protected function acceptUrl(): Attribute
    {
        return Attribute::make(
            get: fn (): string => route('unit.invite.show', [
                'unit' => $this->unit?->slug ?? $this->unit_id,
                'token' => $this->token,
            ]),
        );
    }
}
