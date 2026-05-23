<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Unit;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrbatController extends Controller
{
    public function __invoke(Unit $unit)
    {
        Gate::authorize('viewAny', Section::class);

        /** @var list<Section> $sections */
        $sections = $unit
            ->sections()
            ->where('parent_id', null) // only top-level
            ->with('unit:id,slug', 'children') // load children
            ->orderBy('ord', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('units/structure/orbat', [
            'sections' => $sections,
        ]);
    }
}
