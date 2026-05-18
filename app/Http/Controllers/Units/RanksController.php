<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Http\Requests\Units\Ranks\CreateRankRequest;
use App\Models\Rank;
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

    public function create(Unit $unit)
    {
        return Inertia::render('units/ranks/create');
    }

    public function store(Unit $unit, CreateRankRequest $request)
    {
        Rank::create(array_merge([
            'unit_id' => $unit->id,
        ], $request->validated()));

        return Inertia::location(route('unit.ranks.list', ['unit' => $unit->slug]));
    }
}
