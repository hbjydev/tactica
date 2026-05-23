<?php

namespace App\Actions\Units\Invites;

use App\Models\Enums\UnitInviteEventType;
use App\Models\UnitInvite;
use App\Models\UnitInviteEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RecordInviteEvent
{
    public function record(
        UnitInvite $invite,
        UnitInviteEventType $type,
        Request $request,
    ): UnitInviteEvent {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        $referer = $request->headers->get('referer');

        $event = UnitInviteEvent::create([
            'unit_invite_id' => $invite->id,
            'event_type' => $type,
            'user_id' => $request->user()?->id,
            'ip_hash' => $ip
                ? hash_hmac('sha256', $ip, (string) config('app.key'))
                : null,
            'user_agent' => $userAgent ? Str::limit($userAgent, 510, '') : null,
            'referer' => $referer ? Str::limit($referer, 510, '') : null,
        ]);

        $invite->increment('views');

        return $event;
    }
}
