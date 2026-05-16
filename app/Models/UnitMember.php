<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['unit_id', 'user_id', 'rank_id', 'display_name'])]
class UnitMember extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory, HasUlids;

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
