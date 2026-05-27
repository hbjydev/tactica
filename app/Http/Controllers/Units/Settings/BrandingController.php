<?php

namespace App\Http\Controllers\Units\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Routing\Attributes\Controllers\Middleware;

#[Middleware('can:MANAGE_UNIT')]
class BrandingController extends Controller
{
    public function show()
    {
        return inertia('units/settings/branding/show', []);
    }
}
