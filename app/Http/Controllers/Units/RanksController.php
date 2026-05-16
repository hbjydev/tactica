<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Inertia\Inertia;

class RanksController extends Controller
{
    public function list(Unit $unit)
    {
        $ranks = $unit->ranks();

        return Inertia::render('units/ranks/list', [
            'ranks' => $ranks->get(),
        ]);
    }
}
