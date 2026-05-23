<?php

use App\Actions\Units\Invites\RecordInviteEvent;
use App\Models\Enums\UnitInviteEventType;
use App\Models\Enums\UnitPermission;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitInvite;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use App\Models\User;
use Illuminate\Http\Request;

function bootInviteAdmin(): array
{
    $unit = Unit::factory()->create();
    Unit::setCurrent($unit);
    $unit->createDefaultRoles();
    $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

    $user = User::factory()->create();
    $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();
    $role = UnitRole::factory()
        ->for($unit)
        ->withPermissions(UnitPermission::MANAGE_INVITES->value)
        ->create();
    UnitRoleBinding::create([
        'unit_role_id' => $role->id,
        'unit_member_id' => $member->id,
    ]);

    return [$unit, $user];
}

describe('Invite analytics', function () {
    it('hashes IP addresses deterministically and never stores raw IPs', function () {
        $unit = Unit::factory()->create();
        Unit::setCurrent($unit);
        $unit->createDefaultRoles();

        $invite = UnitInvite::factory()->for($unit)->create();

        $request1 = Request::create('/invite/x', 'GET', server: ['REMOTE_ADDR' => '203.0.113.42']);
        $request2 = Request::create('/invite/x', 'GET', server: ['REMOTE_ADDR' => '203.0.113.42']);
        $request3 = Request::create('/invite/x', 'GET', server: ['REMOTE_ADDR' => '198.51.100.7']);

        $action = app(RecordInviteEvent::class);
        $e1 = $action->record($invite, UnitInviteEventType::VIEWED, $request1);
        $e2 = $action->record($invite, UnitInviteEventType::VIEWED, $request2);
        $e3 = $action->record($invite, UnitInviteEventType::VIEWED, $request3);

        expect($e1->ip_hash)->toBe($e2->ip_hash);
        expect($e1->ip_hash)->not->toBe($e3->ip_hash);
        expect($e1->ip_hash)->not->toContain('203.0.113.42');
        expect($e1->ip_hash)->toHaveLength(64);
    });

    it('keeps views counter in sync with event log', function () {
        $unit = Unit::factory()->create();
        Unit::setCurrent($unit);
        $unit->createDefaultRoles();

        $invite = UnitInvite::factory()->for($unit)->create();
        $action = app(RecordInviteEvent::class);
        $request = Request::create('/invite/x', 'GET');

        $action->record($invite, UnitInviteEventType::VIEWED, $request);
        $action->record($invite, UnitInviteEventType::REJECTED, $request);
        $action->record($invite, UnitInviteEventType::ACCEPTED, $request);

        expect($invite->fresh()->views)->toBe(3);
        expect($invite->events()->count())->toBe(3);
    });

    it('returns events from the show endpoint when authorized', function () {
        [$unit, $user] = bootInviteAdmin();
        $invite = UnitInvite::factory()->for($unit)->create();

        $action = app(RecordInviteEvent::class);
        $action->record($invite, UnitInviteEventType::VIEWED, Request::create('/x', 'GET'));

        $response = $this->actingAs($user)->get(route('unit.invites.show', [
            'unit' => $unit->slug,
            'invite' => $invite->id,
        ]));

        $response->assertOk();
        $response->assertJsonCount(1, 'events');
        $response->assertJsonPath('invite.id', $invite->id);
    });

    it('blocks the show endpoint without MANAGE_INVITES', function () {
        $unit = Unit::factory()->create();
        Unit::setCurrent($unit);
        $unit->createDefaultRoles();
        $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

        $user = User::factory()->create();
        UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

        $invite = UnitInvite::factory()->for($unit)->create();

        $response = $this->actingAs($user)->get(route('unit.invites.show', [
            'unit' => $unit->slug,
            'invite' => $invite->id,
        ]));

        $response->assertForbidden();
    });
});
