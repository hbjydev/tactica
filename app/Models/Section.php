<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @property List<\App\Models\UnitMember> $members
 */
#[Fillable(['unit_id', 'display_name', 'description', 'callsign', 'ord', 'parent_id'])]
class Section extends Model
{
    use HasUlids;

    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class)->orderBy('ord', 'asc');
    }

    public function parent(): BelongsTo
    {
        return $this
            ->belongsTo(self::class, 'parent_id')
            ->with(['parent', 'slots', 'slots.member']);
    }

    public function children(): HasMany
    {
        return $this
            ->hasMany(self::class, 'parent_id')
            ->with(['children', 'slots', 'slots.member']);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function members(): HasManyThrough
    {
        return $this->hasManyThrough(UnitMember::class, Slot::class, 'section_id', 'id', 'id', 'unit_member_id');
    }
}
