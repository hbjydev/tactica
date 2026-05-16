<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show(Unit $unit)
    {
        return Inertia::render('units/dashboard', []);
    }
}
