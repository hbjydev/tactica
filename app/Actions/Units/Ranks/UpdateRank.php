<?php

namespace App\Actions\Units\Ranks;

use App\Concerns\RankValidationRules;
use App\Models\Rank;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateRank
{
    use RankValidationRules;

    /**
     * Update a rank with the given input data.
     *
     * If the `ord` value changes and another rank already occupies that position,
     * the affected ranks are shifted to make room — preserving a gapless ordering.
     */
    public function update(Rank $rank, array $input)
    {
        Validator::make($input, $this->rankRules($rank->unit_id, $rank->id))->validate();

        DB::transaction(function () use ($rank, $input) {
            $newOrd = (int) $input['ord'];
            $oldOrd = (int) $rank->ord;

            if ($newOrd !== $oldOrd) {
                if ($newOrd > $oldOrd) {
                    // Moving up: shift ranks in the vacated range down by one
                    Rank::where('unit_id', $rank->unit_id)
                        ->where('id', '!=', $rank->id)
                        ->whereBetween('ord', [$oldOrd + 1, $newOrd])
                        ->decrement('ord');
                } else {
                    // Moving down: shift ranks in the vacated range up by one
                    Rank::where('unit_id', $rank->unit_id)
                        ->where('id', '!=', $rank->id)
                        ->whereBetween('ord', [$newOrd, $oldOrd - 1])
                        ->increment('ord');
                }
            }

            $rank->fill($input);
            $rank->save();
        });
    }
}
