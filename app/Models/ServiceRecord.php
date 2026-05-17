<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

#[Table('service_record')]
#[Fillable(['unit_member_id', 'performed_by', 'type', 'data'])]
class ServiceRecord extends Model
{
    use HasUlids;

    protected $casts = [
        'data' => 'array',
    ];

    public function unitMember()
    {
        return $this->belongsTo(UnitMember::class);
    }

    public function performedBy()
    {
        return $this->belongsTo(UnitMember::class, 'performed_by');
    }
}
