<?php

namespace App\Http\Controllers\Units;

use App\Actions\Units\Invites\AcceptUnitInvite;
use App\Actions\Units\Invites\InviteNotUsableException;
use App\Actions\Units\Invites\RecordInviteEvent;
use App\Http\Controllers\Controller;
use App\Models\Enums\UnitInviteEventType;
use App\Models\Unit;
use App\Models\UnitInvite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InviteAcceptanceController extends Controller
{
    public function show(
        Unit $unit,
        string $token,
        Request $request,
        AcceptUnitInvite $accept,
        RecordInviteEvent $record,
    ) {
        $invite = UnitInvite::query()
            ->where('unit_id', $unit->id)
            ->where('token', $token)
            ->first();

        if ($invite === null) {
            return Inertia::render('units/invites/invalid', [
                'reason' => 'not_found',
                'unit' => $unit->only(['slug', 'display_name']),
            ])->toResponse($request)->setStatusCode(404);
        }

        if (! $invite->isUsable()) {
            $record->record($invite, UnitInviteEventType::REJECTED, $request);

            return Inertia::render('units/invites/invalid', [
                'reason' => $invite->status,
                'unit' => $unit->only(['slug', 'display_name']),
            ]);
        }

        if (! $request->user()) {
            $record->record($invite, UnitInviteEventType::VIEWED, $request);

            $request->session()->put('pending_invite', [
                'unit' => $unit->slug,
                'token' => $token,
            ]);
            $request->session()->put('url.intended', $request->fullUrl());

            return redirect()->away(route('login'));
        }

        try {
            $result = $accept->accept($invite, $request->user());
        } catch (InviteNotUsableException $e) {
            $record->record($invite, UnitInviteEventType::REJECTED, $request);

            return Inertia::render('units/invites/invalid', [
                'reason' => $invite->fresh()->status,
                'unit' => $unit->only(['slug', 'display_name']),
            ]);
        }

        $type = $result['alreadyMember']
            ? UnitInviteEventType::ALREADY_MEMBER
            : UnitInviteEventType::ACCEPTED;
        $record->record($invite, $type, $request);

        $request->session()->forget('pending_invite');

        Inertia::flash('toast', $result['alreadyMember']
            ? [
                'type' => 'info',
                'message' => __("You're already a member of :unit.", ['unit' => $unit->display_name]),
            ]
            : [
                'type' => 'success',
                'message' => __('Welcome to :unit.', ['unit' => $unit->display_name]),
            ]);

        return redirect()->route('unit.dashboard', ['unit' => $unit->slug]);
    }
}
