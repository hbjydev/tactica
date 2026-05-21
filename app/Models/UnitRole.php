<?php

namespace App\Models;

use App\Models\Enums\UnitPermission;
use App\Models\Enums\UnitRoleType;
use Database\Factories\UnitRoleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @property int $permissions
 * @property UnitRoleType $type
 */
#[Fillable('unit_id', 'display_name', 'description', 'permissions', 'type')]
class UnitRole extends Model
{
    /** @use HasFactory<UnitRoleFactory> */
    use HasFactory, HasUlids;

    protected $casts = [
        'type' => UnitRoleType::class,
    ];

    public function isEditable(): bool
    {
        return $this->type->isEditable();
    }

    /**
     * The unit that this role belongs to.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * The members that have this role.
     */
    public function members(): HasManyThrough
    {
        return $this->hasManyThrough(
            UnitMember::class,
            UnitRoleBinding::class,
            'unit_role_id',
            'id',
            'id',
            'unit_member_id'
        );
    }

    public function bindings()
    {
        return $this->hasMany(UnitRoleBinding::class);
    }

    public function hasPermission(UnitPermission $permission): bool
    {
        return ($this->permissions & $permission->value) === $permission;
    }

    public function addPermission(UnitPermission $permission): void
    {
        $this->permissions |= $permission->value;
    }

    public function removePermission(UnitPermission $permission): void
    {
        $this->permissions &= ~$permission->value;
    }

    public static function type(Unit|string $unitOrUnitId, UnitRoleType $type): self
    {
        if ($type === UnitRoleType::CUSTOM) {
            throw new \InvalidArgumentException('Custom roles cannot be retrieved by type.');
        }

        if (is_string($unitOrUnitId)) {
            $unitId = $unitOrUnitId;
        } else {
            $unitId = $unitOrUnitId->id;
        }

        $role = self::query()
            ->where('unit_id', $unitId)
            ->where('type', UnitRoleType::EVERYONE)
            ->firstOrFail();

        return $role;
    }

    public static function everyoneRole(Unit|string $unitOrUnitId): self
    {
        return self::type($unitOrUnitId, UnitRoleType::EVERYONE);
    }

    public static function membersRole(Unit|string $unitOrUnitId): self
    {
        return self::type($unitOrUnitId, UnitRoleType::MEMBERS);
    }

    public static function administratorRole(Unit|string $unitOrUnitId): self
    {
        return self::type($unitOrUnitId, UnitRoleType::ADMIN);
    }
}
