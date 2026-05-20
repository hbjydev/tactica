<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // $unit and $member are defined here to ensure Wayfinder will detect
        // type hints for them when generating the Inertia shared data types.

        /** @var \App\Models\Unit|null $unit */
        $unit = null;

        /** @var \App\Models\UnitMember|null $member */
        $member = null;

        /** @var list<\App\Models\Unit> $member */
        $userUnits = [];
        if ($request->user()) {
            $userUnits = $request->user()->units()->select([
                'units.id',
                'units.slug',
                'units.display_name',
            ])->get();
        }

        $data = [
            ...parent::share($request),
            'name' => config('app.name'),
            'appUrl' => $request->getSchemeAndHttpHost(),
            'base' => [
                'baseDomain' => config('app.domain'),
            ],
            'auth' => [
                'user' => $request->user(),
                'units' => $userUnits,
                'member' => $member,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'unit' => $unit,
        ];

        return $data;
    }
}
