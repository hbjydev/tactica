<?php

namespace App\Actions\Units\Invites;

use App\Models\UnitInvite;

class DeleteUnitInvite
{
    public function delete(UnitInvite $invite): void
    {
        $invite->delete();
    }
}
