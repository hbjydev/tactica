<?php

namespace App\Http\Controllers\Units\Settings;

use App\Actions\Units\UpdateUnitBranding;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

class BrandingController extends Controller
{
    public function __construct(
        protected UpdateUnitBranding $action,
    ) { }

    public function show()
    {
        return inertia('units/settings/branding', []);
    }

    public function update(Unit $unit, Request $request)
    {
        $this->action->update($unit, $request->all());
        return to_route('unit.branding.show', [ 'unit' => $unit ]);
    }
}
