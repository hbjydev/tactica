<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Sections\CreateNewSection;
use App\Actions\Units\Sections\DeleteSection;
use App\Actions\Units\Sections\UpdateSection;
use App\Actions\Units\Slots\CreateNewSlot;
use App\Actions\Units\Slots\DeleteSlot;
use App\Actions\Units\Slots\UpdateSlot;
use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Slot;
use App\Models\Unit;
use App\Models\UnitMember;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SectionsController extends Controller
{
    public function list(Unit $unit)
    {
        /** @var LengthAwarePaginator<int, UnitMember> $members */
        $sections = $unit
            ->sections()
            ->orderBy('parent_id', 'desc')
            ->orderBy('ord', 'asc')
            ->orderBy('created_at', 'asc')
            ->with('slots', 'unit:id,slug')
            ->paginate(15);

        return Inertia::render('units/structure/sections/list', [
            'sections' => $sections,
        ]);
    }

    public function show(Unit $unit, Section $section)
    {
        return Inertia::render('units/structure/sections/show', [
            'section' => $section
                ->load([
                    'slots',
                    'slots.member',
                    'directParent',
                    'children',
                    'members' => fn ($q) => $q->join('ranks', 'ranks.id', '=', 'unit_members.rank_id')
                        ->orderBy('ranks.ord', 'desc')
                        ->select('unit_members.*'),
                    'members.rank',
                ]),
        ]);
    }

    public function create(Unit $unit)
    {
        /** @var list<Section> $sections */
        $sections = $unit->sections()->orderBy('ord', 'asc')->get();

        return Inertia::render('units/structure/sections/create', [
            'otherSections' => $sections,
        ]);
    }

    public function store(Unit $unit, Request $request, CreateNewSection $action)
    {
        $action->create($unit, $request->all());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully created section.')]);

        return to_route('unit.structure.sections.list', ['unit' => $unit]);
    }

    public function storeSlot(Unit $unit, Section $section, Request $request, CreateNewSlot $action)
    {
        $action->create($section, $request->post());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully created slot.')]);

        return to_route('unit.structure.sections.show', ['unit' => $unit, 'section' => $section]);
    }

    public function edit(Unit $unit, Section $section)
    {
        /** @var list<Section> $sections */
        $sections = $unit->sections()->orderBy('ord', 'asc')->get();

        return Inertia::render('units/structure/sections/edit', [
            'section' => $section,
            'otherSections' => $sections,
        ]);
    }

    public function updateSlot(Unit $unit, Section $section, Slot $slot, Request $request, UpdateSlot $action)
    {
        $action->update($section, $slot, $request->post());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully updated slot.')]);

        return to_route('unit.structure.sections.show', ['unit' => $unit, 'section' => $section]);
    }

    public function update(Unit $unit, Section $section, Request $request, UpdateSection $action)
    {
        try {
            $action->update($section, $request->all());
        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }

            Inertia::flash('toast', ['type' => 'error', 'message' => __('Failed to update section.')]);

            return to_route('unit.structure.sections.edit', ['unit' => $unit, 'section' => $section]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully updated section.')]);

        return to_route('unit.structure.sections.show', ['unit' => $unit, 'section' => $section]);
    }

    public function destroy(Unit $unit, Section $section, DeleteSection $action)
    {
        $action->delete($section);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully removed section.')]);

        return to_route('unit.structure.sections.list', ['unit' => $unit]);
    }

    public function destroySlot(Unit $unit, Section $section, Slot $slot, DeleteSlot $action)
    {
        $action->delete($slot);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully removed slot from section.')]);

        return to_route('unit.structure.sections.show', ['unit' => $unit, 'section' => $section]);
    }
}
