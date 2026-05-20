<?php

namespace App\Http\Middleware;

use App\Models\Unit;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareUnitData
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $unit = Unit::query()
            ->where('slug', $request->route()->originalParameter('unit'))
            ->firstOrFail();

        Inertia::shareOnce('unit', fn() => $unit);

        $user = $request->user();
        if ($user != null) {
            $member = $user
                ->unitMemberships()
                ->where('unit_id', $unit->id)
                ->with('rank')
                ->first();

            Inertia::shareOnce('auth.member', fn() => $member);
        }

        return $next($request);
    }
}
