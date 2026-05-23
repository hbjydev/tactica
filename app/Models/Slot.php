<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Fillable('section_id', 'unit_member_id', 'display_name', 'ord')]
class Slot extends Model
{
    use HasUlids;

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function member()
    {
        return $this->belongsTo(UnitMember::class, 'unit_member_id');
    }

    public function unit()
    {
        return $this->hasOneThrough(Unit::class, Section::class, 'id', 'id', 'section_id', 'unit_id');
    }
}
