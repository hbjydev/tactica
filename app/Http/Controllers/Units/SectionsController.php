<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Sections\CreateNewSection;
use App\Actions\Units\Sections\DeleteSection;
use App\Actions\Units\Sections\UpdateSection;
use App\Http\Controllers\Controller;
use App\Models\Section;
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
        Gate::authorize('viewAny', Section::class);

        /** @var LengthAwarePaginator<int, UnitMember> $members */
        $sections = $unit
            ->sections()
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
        Gate::authorize('view', $section);

        return Inertia::render('units/structure/sections/show', [
            'section' => $section->load('slots', 'slots.member', 'members'),
        ]);
    }

    public function create(Unit $unit)
    {
        Gate::authorize('create', Section::class);

        /** @var list<Section> $sections */
        $sections = $unit->sections()->orderBy('ord', 'asc')->get();

        return Inertia::render('units/structure/sections/create', [
            'otherSections' => $sections,
        ]);
    }

    public function store(Unit $unit, Request $request, CreateNewSection $action)
    {
        Gate::authorize('create', Section::class);

        $action->create($unit, $request->post());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully created section.')]);

        return to_route('unit.structure.sections.list', ['unit' => $unit]);
    }

    public function edit(Unit $unit, Section $section)
    {
        Gate::authorize('update', $section);

        /** @var list<Section> $sections */
        $sections = $unit->sections()->orderBy('ord', 'asc')->get();

        return Inertia::render('units/structure/sections/edit', [
            'section' => $section,
            'otherSections' => $sections,
        ]);
    }

    public function update(Unit $unit, Section $section, Request $request, UpdateSection $action)
    {
        Gate::authorize('update', $section);

        try {
            $action->update($section, $request->post());
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
        Gate::authorize('destroy', $section);

        $action->delete($section);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully removed section.')]);

        return to_route('unit.structure.sections.list', ['unit' => $unit]);
    }
}
