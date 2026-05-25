<?php

namespace App\Models;

use App\Models\Enums\UnitMemberStatus;
use App\Models\Enums\UnitPermission;
use App\Observers\UnitMemberObserver;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $permissions The member's effective permissions, calculated from their assigned roles.
 * @property string $formal_name The member's formal name, calculated from their rank and display name.
 * @property string $steamid64 The member's linked SteamID64, retrieved from their associated user.
 * @property string $discord_id The member's linked Discord ID, retrieved from their associated user.
 */
#[Fillable(['unit_id', 'user_id', 'rank_id', 'display_name', 'status', 'status_changed_at', 'rank_changed_at'])]
#[ObservedBy([UnitMemberObserver::class])]
#[Appends(['permissions', 'formal_name', 'steamid64', 'discord_id'])]
class UnitMember extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory, HasUlids;

    protected $casts = [
        'status' => UnitMemberStatus::class,
        'status_changed_at' => 'datetime',
        'rank_changed_at' => 'datetime',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function roleBindings()
    {
        return $this->hasMany(UnitRoleBinding::class);
    }

    public function roles()
    {
        return $this->hasManyThrough(
            UnitRole::class,
            UnitRoleBinding::class,
            'unit_member_id',
            'id',
            'id',
            'unit_role_id',
        );
    }

    public function serviceRecords()
    {
        return $this->hasMany(ServiceRecord::class);
    }

    public function permissions(): Attribute
    {
        return Attribute::make(
            get: fn () => $this
                ->roles()
                ->pluck('permissions')
                ->reduce(fn ($carry, $item) => $carry | $item, 0),
        );
    }

    public function discordId(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user?->discord_id,
        );
    }

    public function steamid64(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user?->steamid64,
        );
    }

    public function formalName(): Attribute
    {
        return Attribute::make(
            get: function () {
                $abbreviation = $this->rank()->pluck('abbreviation')->first();

                return $abbreviation
                    ? "{$abbreviation} {$this->display_name}"
                    : $this->display_name;
            },
        );
    }

    public function can(UnitPermission $permission): bool
    {
        $permissions = $this->permissions;

        if (($permissions & UnitPermission::ADMINISTRATOR->value) === UnitPermission::ADMINISTRATOR->value) {
            return true;
        }

        return ($permissions & $permission->value) === $permission->value;
    }
}
