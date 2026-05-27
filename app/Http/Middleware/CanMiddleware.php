<?php

namespace App\Http\Middleware;

use App\Models\Enums\UnitPermission;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string|UnitPermission $permission): Response
    {
        if (is_string($permission)) {
            $permissionItem = collect(UnitPermission::cases())
                ->first(fn ($v) => $v->name == $permission);

            if ($permissionItem === null) {
                abort(500, "Invalid permission: $permission");
            }

            $permission = $permissionItem;
        }

        can($permission) || abort(403);

        return $next($request);
    }
}
