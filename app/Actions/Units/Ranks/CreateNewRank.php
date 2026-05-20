<?php

namespace App\Actions\Units\Ranks;

use App\Concerns\RankValidationRules;
use App\Models\Rank;
use App\Models\Unit;
use Illuminate\Support\Facades\Validator;

class CreateNewRank
{
    use RankValidationRules;

    /**
     * Create a new rank for a given unit.
     */
    public function create(Unit $unit, array $input): Rank
    {
        Validator::make($input, $this->rankRules($unit->id))->validate();

        return Rank::create([
            'unit_id' => $unit->id,
            ...$input,
        ]);
    }
}
