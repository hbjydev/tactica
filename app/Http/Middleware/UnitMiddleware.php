<?php

namespace App\Http\Middleware;

use App\Models\Unit;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class UnitMiddleware
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

        Unit::setCurrent($unit);

        Inertia::shareOnce('unit', fn () => $unit);

        return $next($request);
    }
}
