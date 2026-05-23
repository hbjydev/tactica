<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Enums\UnitPermission;
use App\Models\Unit;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show(Unit $unit)
    {
        can(UnitPermission::VIEW_UNIT) || abort(403);

        return Inertia::render('units/dashboard', []);
    }
}
