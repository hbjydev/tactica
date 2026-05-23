<?php

namespace App\Actions\Units\Invites;

use App\Models\UnitInvite;

class RevokeUnitInvite
{
    public function revoke(UnitInvite $invite): UnitInvite
    {
        if ($invite->revoked_at !== null) {
            return $invite;
        }

        $invite->update(['revoked_at' => now()]);

        return $invite;
    }
}
