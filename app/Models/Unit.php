<?php

namespace App\Models;

use App\Models\Enums\UnitMemberStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Log;

#[Fillable(['slug', 'display_name', 'description'])]
class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory, HasUlids;

    public function members()
    {
        return $this->hasMany(UnitMember::class);
    }

    public function ranks()
    {
        return $this->hasMany(Rank::class);
    }

    public static function createUnit(
        $unitAttributes = [],
        User $user,
    ): Unit
    {
        DB::beginTransaction();

        try {
            $unit = self::create($unitAttributes);

            $captain = Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Captain',
                'abbreviation' => 'Cpt.',
            ]);

            Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Sergeant',
                'abbreviation' => 'Sgt.',
            ]);

            Rank::create([
                'unit_id' => $unit->id,
                'display_name' => 'Private',
                'abbreviation' => 'Pvt.',
            ]);

            UnitMember::create([
                'unit_id' => $unit->id,
                'user_id' => $user->id,
                'display_name' => $user->display_name,
                'rank_id' => $captain->id,
                'rank_changed_at' => now('UTC'),
                'status' => UnitMemberStatus::Active,
                'status_changed_at' => now('UTC'),
            ]);

            DB::commit();

            return $unit;
        } catch (\Exception $e) {
            Log::error('Failed to complete unit creation transaction', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            DB::rollBack();
            throw $e;
        }
    }
}
