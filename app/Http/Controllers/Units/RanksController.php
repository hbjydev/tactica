<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Ranks\CreateNewRank;
use App\Actions\Units\Ranks\DeleteRank;
use App\Actions\Units\Ranks\RankNotEmptyException;
use App\Actions\Units\Ranks\UpdateRank;
use App\Http\Controllers\Controller;
use App\Http\Requests\Units\Ranks\CreateRankRequest;
use App\Models\Rank;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RanksController extends Controller
{
    public function list(Unit $unit)
    {
        /** @var list<Rank> $ranks */
        $ranks = $unit
            ->ranks()
            ->with('unit:id,slug')
            ->orderBy('ord', 'desc')
            ->get();

        return Inertia::render('units/ranks/list', [
            'ranks' => $ranks,
        ]);
    }

    public function create(Unit $unit)
    {
        $nextOrd = $unit->ranks()->max('ord') + 1;

        return Inertia::render('units/ranks/create', ['nextOrd' => $nextOrd]);
    }

    public function store(Unit $unit, CreateRankRequest $request, CreateNewRank $action)
    {
        $action->create($unit, $request->post());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully created rank.')]);

        return to_route('unit.ranks.list', ['unit' => $unit]);
    }

    public function edit(Unit $unit, Rank $rank)
    {
        return Inertia::render('units/ranks/edit', [
            'rank' => $rank,
        ]);
    }

    public function update(Unit $unit, Rank $rank, Request $request, UpdateRank $action)
    {
        try {
            $action->update($rank, $request->post());
        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }

            Inertia::flash('toast', ['type' => 'error', 'message' => __('Failed to update rank.')]);

            return to_route('unit.ranks.edit', ['unit' => $unit, 'rank' => $rank]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully updated rank.')]);

        return to_route('unit.ranks.list', ['unit' => $unit]);
    }

    public function destroy(Unit $unit, Rank $rank, DeleteRank $action)
    {
        try {
            $action->delete($rank);
        } catch (\Exception $e) {
            if ($e instanceof RankNotEmptyException) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('You cannot delete this rank as it has members attached to it.')]);

                return back();
            }

            throw $e;
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully deleted rank.')]);

        return to_route('unit.ranks.list', ['unit' => $unit]);
    }
}
