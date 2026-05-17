<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UnitCreateRequest;
use App\Models\Unit;
use Inertia\Inertia;

class UnitsController extends Controller
{
    public function create()
    {
        return Inertia::render('public/units/create');
    }

    public function store(UnitCreateRequest $request)
    {
        $unit = Unit::createUnit($request->validated(), $request->user());

        return Inertia::location(route('unit.dashboard', ['unit' => $unit->slug]));
    }
}
