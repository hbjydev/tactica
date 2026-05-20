<?php

namespace App\Models;

use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['unit_id', 'display_name', 'abbreviation', 'description', 'ord'])]
class Rank extends Model
{
    /** @use HasFactory<UnitFactory> */
    use HasFactory, HasUlids;

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function members()
    {
        return $this->hasMany(UnitMember::class);
    }
}
