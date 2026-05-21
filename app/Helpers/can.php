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

        if ($user === null || $user->member === null) {
            /** @var UnitRole $everyoneRole */
            $everyoneRole = UnitRole::type($unit, UnitRoleType::EVERYONE);

            return $everyoneRole->hasPermission($permission);
        } else {
            // User is a unit member, we can check their permissions.
            return $user->member->can($permission);
        }
    }
}
