<?php

namespace App\Models;

use Database\Factories\UnitRoleBindingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable('unit_role_id', 'unit_member_id')]
class UnitRoleBinding extends Model
{
    /** @use HasFactory<UnitRoleBindingFactory> */
    use HasFactory, HasUlids;

    public function unitRole()
    {
        return $this->belongsTo(UnitRole::class);
    }

    public function unitMember()
    {
        return $this->belongsTo(UnitMember::class);
    }

    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            UnitMember::class,
            'id',
            'id',
            'unit_member_id',
            'user_id',
        );
    }
}
