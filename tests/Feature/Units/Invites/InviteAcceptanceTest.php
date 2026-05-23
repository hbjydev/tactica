<?php

use App\Models\Enums\UnitInviteEventType;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitInvite;
use App\Models\UnitInviteEvent;
use App\Models\UnitMember;
use App\Models\User;
use App\Notifications\WelcomeToUnitNotification;
use Illuminate\Support\Facades\Notification;

function makeUnitForInvites(): Unit
{
    $unit = Unit::factory()->create();
    Unit::setCurrent($unit);
    $unit->createDefaultRoles();
    Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

    return $unit;
}

describe('Invite acceptance endpoint', function () {
    it('redirects guests to the login route and stashes the pending invite', function () {
        $unit = makeUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->create();

        $response = $this->get(route('unit.invite.show', [
            'unit' => $unit->slug,
            'token' => $invite->token,
        ]));

        $response->assertRedirect(route('login'));
        expect(session('pending_invite'))->toBe([
            'unit' => $unit->slug,
            'token' => $invite->token,
        ]);
        expect(session('url.intended'))->toContain($invite->token);
        $this->assertDatabaseHas('unit_invite_events', [
            'unit_invite_id' => $invite->id,
            'event_type' => UnitInviteEventType::VIEWED->value,
        ]);
        expect($invite->fresh()->views)->toBe(1);
    });

    it('creates a member, sends the welcome email, and redirects when an authed non-member clicks', function () {
        Notification::fake();

        $unit = makeUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->create();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('unit.invite.show', [
            'unit' => $unit->slug,
            'token' => $invite->token,
        ]));

        $response->assertRedirect(route('unit.dashboard', ['unit' => $unit->slug]));

        $this->assertDatabaseHas('unit_members', [
            'unit_id' => $unit->id,
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('unit_invite_events', [
            'unit_invite_id' => $invite->id,
            'event_type' => UnitInviteEventType::ACCEPTED->value,
            'user_id' => $user->id,
        ]);
        expect($invite->fresh()->uses)->toBe(1);

        Notification::assertSentTo($user, WelcomeToUnitNotification::class);
    });

    it('records already_member and does not double-join existing members', function () {
        Notification::fake();

        $unit = makeUnitForInvites();
        $rank = $unit->ranks()->first();
        $user = User::factory()->create();
        UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

        $invite = UnitInvite::factory()->for($unit)->create();

        $response = $this->actingAs($user)->get(route('unit.invite.show', [
            'unit' => $unit->slug,
            'token' => $invite->token,
        ]));

        $response->assertRedirect(route('unit.dashboard', ['unit' => $unit->slug]));

        $this->assertDatabaseHas('unit_invite_events', [
            'unit_invite_id' => $invite->id,
            'event_type' => UnitInviteEventType::ALREADY_MEMBER->value,
        ]);

        expect($invite->fresh()->uses)->toBe(0);
        expect(UnitMember::where('unit_id', $unit->id)->where('user_id', $user->id)->count())->toBe(1);

        Notification::assertNothingSent();
    });

    it('renders an invalid page and logs rejected for expired invites', function () {
        $unit = makeUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->expired()->create();

        $response = $this->get(route('unit.invite.show', [
            'unit' => $unit->slug,
            'token' => $invite->token,
        ]));

        $response->assertOk();
        $this->assertDatabaseHas('unit_invite_events', [
            'unit_invite_id' => $invite->id,
            'event_type' => UnitInviteEventType::REJECTED->value,
        ]);
    });

    it('returns 404 for unknown tokens', function () {
        $unit = makeUnitForInvites();

        $response = $this->get(route('unit.invite.show', [
            'unit' => $unit->slug,
            'token' => 'completely-bogus-token',
        ]));

        $response->assertNotFound();
        expect(UnitInviteEvent::count())->toBe(0);
    });
});
