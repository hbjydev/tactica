<?php

namespace App\Models;

use App\Models\Enums\UnitMemberStatus;
use App\Observers\UnitMemberObserver;
use Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['unit_id', 'user_id', 'rank_id', 'display_name', 'status', 'status_changed_at', 'rank_changed_at'])]
#[ObservedBy([UnitMemberObserver::class])]
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

    public function serviceRecords()
    {
        return $this->hasMany(ServiceRecord::class);
    }
}
