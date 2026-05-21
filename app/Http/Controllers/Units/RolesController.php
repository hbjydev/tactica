<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function list(Unit $unit)
    {
        Gate::authorize('viewAny', UnitRole::class);

        $roles = $unit
            ->roles()
            ->with([
                'members' => fn ($q) => $q->with('user', 'rank'),
            ])
            ->orderBy('created_at', 'asc')
            ->get();

        $members = $unit
            ->members()
            ->with('user', 'rank')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('units/roles/list', [
            'roles' => $roles,
            'members' => $members,
        ]);
    }

    public function updatePermissions(Unit $unit, UnitRole $role, Request $request)
    {
        Gate::authorize('update', $role);

        $validated = $request->validate([
            'permissions' => ['required', 'integer', 'min:0'],
        ]);

        $role->update(['permissions' => $validated['permissions']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Permissions updated.')]);

        return back();
    }

    public function addBinding(Unit $unit, UnitRole $role, Request $request)
    {
        Gate::authorize('manageMembers', $role);

        $validated = $request->validate([
            'member_id' => ['required', 'string', 'exists:unit_members,id'],
        ]);

        // Prevent duplicate bindings.
        $existing = UnitRoleBinding::query()
            ->where('unit_role_id', $role->id)
            ->where('unit_member_id', $validated['member_id'])
            ->exists();

        if (! $existing) {
            UnitRoleBinding::create([
                'unit_role_id' => $role->id,
                'unit_member_id' => $validated['member_id'],
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Member added to role.')]);

        return back();
    }

    public function removeBinding(Unit $unit, UnitRole $role, UnitMember $member)
    {
        Gate::authorize('manageMembers', $role);

        UnitRoleBinding::query()
            ->where('unit_role_id', $role->id)
            ->where('unit_member_id', $member->id)
            ->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Member removed from role.')]);

        return back();
    }
}
