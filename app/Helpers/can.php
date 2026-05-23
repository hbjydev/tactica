<?php

use App\Models\Enums\UnitPermission;
use App\Models\Enums\UnitRoleType;
use App\Models\Unit;
use App\Models\UnitRole;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

if (! function_exists('can')) {
    function can(
        UnitPermission $permission,
        ?Unit $unit = null,
        ?User $user = null,
    ): bool {
        $user = $user ?? Auth::user();
        $unit = $unit ?? Unit::current();

        if ($unit === null) {
            throw new RuntimeException('No unit context available for permission check.');
        }

        $member = $user === null
            ? null
            : $user->unitMemberships()
                ->where('unit_id', $unit->id)
                ->with('rank')
                ->first();

        if ($member === null) {
            /** @var UnitRole $everyoneRole */
            $everyoneRole = UnitRole::type($unit, UnitRoleType::EVERYONE);

            return $everyoneRole->hasPermission($permission);
        }

        return $member->can($permission);
    }
}
