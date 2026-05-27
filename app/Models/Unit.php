<?php

namespace App\Models;

use App\Models\Enums\UnitPermission;
use App\Models\Enums\UnitRoleType;
use Carbon\Carbon;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property string $id
 * @property string $slug
 * @property string $display_name
 * @property string|null $description
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['slug', 'display_name', 'description'])]
#[Appends(['avatar_url'])]
class Unit extends Model implements HasMedia
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory, HasUlids, InteractsWithMedia;

    protected static ?Unit $current = null;

    public static function setCurrent(Unit $unit): void
    {
        static::$current = $unit;
    }

    public static function current(): ?Unit
    {
        return static::$current;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    public function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->getMedia('avatar')->count() == 1) {
                    return $this
                        ->getFirstMedia('avatar')
                        ->getTemporaryUrl(Carbon::now()->addMinutes(5));
                }

                return null;
            },
        );
    }

    public function members(): HasMany
    {
        return $this->hasMany(UnitMember::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function ranks(): HasMany
    {
        return $this->hasMany(Rank::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(UnitRole::class);
    }

    public function invites(): HasMany
    {
        return $this->hasMany(UnitInvite::class);
    }

    /**
     * @return array<string, UnitRole> The created default roles.
     */
    public function createDefaultRoles()
    {
        $adminRole = UnitRole::create([
            'unit_id' => $this->id,
            'display_name' => 'Administrator',
            'description' => 'Full access to all unit features and settings.',
            'permissions' => UnitPermission::ADMINISTRATOR,
            'type' => UnitRoleType::ADMIN,
        ]);

        $membersRole = UnitRole::create([
            'unit_id' => $this->id,
            'display_name' => 'Member',
            'description' => 'The role assigned to regular members of the unit.',
            'permissions' => UnitPermission::VIEW_UNIT,
            'type' => UnitRoleType::MEMBERS,
        ]);

        $everyoneRole = UnitRole::create([
            'unit_id' => $this->id,
            'display_name' => 'Everyone',
            'description' => 'The role non-members and members without a specific role are assigned to.',
            'permissions' => UnitPermission::VIEW_UNIT,
            'type' => UnitRoleType::EVERYONE,
        ]);

        return [
            'admin' => $adminRole,
            'members' => $membersRole,
            'everyone' => $everyoneRole,
        ];
    }
}
