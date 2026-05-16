<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show(Unit $unit)
    {
        Log::info("Showing dashboard for unit: {$unit->display_name} (ID: {$unit->id})");

        $data = ['unit' => $unit];

        if (Auth::user() != null) {
            Log::info("Authenticated user: " . Auth::user()->name);
        }

        return Inertia::render('units/dashboard', $data);
    }
}
