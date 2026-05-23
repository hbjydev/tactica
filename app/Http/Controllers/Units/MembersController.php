<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Members\DeleteUnitMember;
use App\Actions\Units\Members\UpdateUnitMember;
use App\Http\Controllers\Controller;
use App\Models\Enums\UnitPermission;
use App\Models\Unit;
use App\Models\UnitMember;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MembersController extends Controller
{
    public function list(Unit $unit)
    {
        Gate::authorize('viewAny', UnitMember::class);

        /** @var LengthAwarePaginator<int, UnitMember> $members */
        $members = $unit
            ->members()
            ->select('unit_members.*')
            ->join('ranks', 'ranks.id', '=', 'unit_members.rank_id')
            ->orderBy('ranks.ord', 'desc')
            ->orderBy('unit_members.created_at', 'asc')
            ->with('rank', 'unit:id,slug')
            ->paginate(15);

        return Inertia::render('units/members/list', [
            'members' => $members,
        ]);
    }

    public function show(Unit $unit, UnitMember $member)
    {
        Gate::authorize('view', $member);

        return Inertia::render('units/members/show', [
            'member' => $member->load('rank', 'user'),
        ]);
    }

    public function edit(Unit $unit, UnitMember $member)
    {
        Gate::authorize('update', $member);

        $ranks = $unit->ranks()->orderBy('ord', 'desc')->get();

        return Inertia::render('units/members/edit', [
            'member' => $member->load('rank', 'user'),
            'ranks' => $ranks,
        ]);
    }

    public function update(Unit $unit, UnitMember $member, Request $request, UpdateUnitMember $action)
    {
        Gate::authorize('update', $member);

        if ($request->has('rank_id') && $member->rank_id != $request->post('rank_id')) {
            can(UnitPermission::MANAGE_MEMBERS)
                || throw new UnauthorizedException(
                    'You do not have permission to change this member\'s rank.',
                );
        }

        try {
            $action->update($member, $request->post());
        } catch (\Exception $e) {
            if ($e instanceof ValidationException) {
                throw $e;
            }

            Inertia::flash('toast', ['type' => 'error', 'message' => __('Failed to update member profile.')]);

            return to_route('unit.members.edit', ['unit' => $unit, 'member' => $member]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully updated member profile.')]);

        return to_route('unit.members.show', ['unit' => $unit, 'member' => $member]);
    }

    public function destroy(Unit $unit, UnitMember $member, DeleteUnitMember $action)
    {
        Gate::authorize('destroy', $member);

        $action->delete($member);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Successfully removed member from unit.')]);

        return to_route('unit.members.list', ['unit' => $unit]);
    }
}
