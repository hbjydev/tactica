<?php

namespace App\Http\Controllers\Home;

use App\Actions\Units\CreateNewUnit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitWizardController extends Controller
{
    public function create()
    {
        return Inertia::render('public/units/create');
    }

    public function store(Request $request, CreateNewUnit $action)
    {
        $unit = $action->create($request->user(), $request->all());

        return Inertia::location(route('unit.dashboard', ['unit' => $unit->slug]));
    }
}
