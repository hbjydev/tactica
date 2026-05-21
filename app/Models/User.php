<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property string $id
 * @property string $display_name
 * @property string $username
 * @property string $email
 * @property string $email_verified_at
 * @property string $steamid64
 * @property string $discord_id
 * @property string $created_at
 * @property string $updated_at
 * @property ?UnitMember $member The user's membership in the current unit, if any.
 */
#[Fillable(['display_name', 'username', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUlids, Notifiable, TwoFactorAuthenticatable;

    public function unitMemberships()
    {
        return $this->hasMany(UnitMember::class);
    }

    public function member(): HasOne
    {
        return $this
            ->hasOne(UnitMember::class)
            ->where('unit_id', Unit::current()->id)
            ->with('rank');
    }

    public function units(): HasManyThrough
    {
        return $this->hasManyThrough(
            Unit::class,
            UnitMember::class,
            'user_id',
            'id',
            'id',
            'unit_id'
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
