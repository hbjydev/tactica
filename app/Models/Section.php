<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property List<\App\Models\UnitMember> $members
 */
#[Fillable(['unit_id', 'display_name', 'description', 'callsign', 'ord', 'parent_id'])]
#[Appends(['avatar_url'])]
class Section extends Model implements HasMedia
{
    use HasUlids, InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    public function slots(): HasMany
    {
        return $this
            ->hasMany(Slot::class)
            ->orderBy('ord', 'asc');
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

    public function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->getMedia('avatar')->count() == 1) {
                    return $this->getFirstMediaUrl('avatar');
                }
                return null;
            },
        );
    }
}
