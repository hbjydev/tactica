<?php

namespace App\Actions\Units\Ranks;

use App\Models\Rank;

class DeleteRank
{
    /**
     * Delete a rank, ensuring that it has no members assigned to it.
     */
    public function delete(Rank $rank)
    {
        if ($rank->members->count() > 0) {
            throw new RankNotEmptyException;
        }

        $rank->delete();
    }
}

class RankNotEmptyException extends \Exception
{
    protected $message = 'Cannot delete a rank that has members assigned to it.';
}
