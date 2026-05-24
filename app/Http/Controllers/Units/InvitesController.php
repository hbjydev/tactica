<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Invites\CreateUnitInvite;
use App\Actions\Units\Invites\DeleteUnitInvite;
use App\Actions\Units\Invites\RevokeUnitInvite;
use App\Actions\Units\Invites\UpdateUnitInvite;
use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\UnitInvite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InvitesController extends Controller
{
    public function __construct(
        private CreateUnitInvite $createInvite,
        private UpdateUnitInvite $updateInvite,
        private RevokeUnitInvite $revokeInvite,
        private DeleteUnitInvite $deleteInvite,
    ) {}

    public function list(Unit $unit)
    {
        Gate::authorize('viewAny', UnitInvite::class);

        $invites = $unit
            ->invites()
            ->with([
                'createdByMember.user',
                'createdByMember.rank',
                'defaultRank',
                'defaultRoles',
                'member.rank',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $ranks = $unit->ranks()->orderBy('ord')->get();

        $roles = $unit->roles()
            ->whereIn('type', ['custom', 'members'])
            ->orderBy('display_name')
            ->get();

        $userlessMembers = $unit->members()
            ->whereNull('user_id')
            ->with('rank')
            ->orderBy('display_name')
            ->get();

        return Inertia::render('units/invites/list', [
            'invites' => $invites,
            'ranks' => $ranks,
            'roles' => $roles,
            'userlessMembers' => $userlessMembers,
        ]);
    }

    public function show(Unit $unit, UnitInvite $invite)
    {
        Gate::authorize('view', $invite);

        $events = $invite
            ->events()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(200)
            ->get();

        return response()->json([
            'invite' => $invite->load(['createdByMember.user', 'defaultRank', 'defaultRoles']),
            'events' => $events,
        ]);
    }

    public function store(Unit $unit, Request $request)
    {
        Gate::authorize('create', UnitInvite::class);

        $member = $request->user()
            ? $request->user()->unitMemberships()->where('unit_id', $unit->id)->first()
            : null;

        $this->createInvite->create($unit, $member, $request->all());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite created.')]);

        return back();
    }

    public function update(Unit $unit, UnitInvite $invite, Request $request)
    {
        Gate::authorize('update', $invite);

        $this->updateInvite->update($invite, $request->all());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite updated.')]);

        return back();
    }

    public function revoke(Unit $unit, UnitInvite $invite)
    {
        Gate::authorize('revoke', $invite);

        $this->revokeInvite->revoke($invite);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite revoked.')]);

        return back();
    }

    public function destroy(Unit $unit, UnitInvite $invite)
    {
        Gate::authorize('delete', $invite);

        $this->deleteInvite->delete($invite);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite deleted.')]);

        return back();
    }
}
