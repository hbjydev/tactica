<?php

use App\Actions\Units\Invites\AcceptUnitInvite;
use App\Actions\Units\Invites\InviteNotUsableException;
use App\Models\Enums\UnitMemberStatus;
use App\Models\Enums\UnitRoleType;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitInvite;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\User;
use App\Notifications\WelcomeToUnitNotification;
use Illuminate\Support\Facades\Notification;

function bootUnitForInvites(): array
{
    $unit = Unit::factory()->create();
    Unit::setCurrent($unit);
    $unit->createDefaultRoles();

    $entryRank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
    $captainRank = Rank::factory()->for($unit)->create(['abbreviation' => 'Cpt', 'ord' => 99]);

    return [$unit, $entryRank, $captainRank];
}

describe('AcceptUnitInvite', function () {
    it('creates a new member at the unit entry rank when no default rank is set', function () {
        Notification::fake();

        [$unit, $entryRank] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->create();
        $user = User::factory()->create();

        $result = app(AcceptUnitInvite::class)->accept($invite, $user);

        expect($result['alreadyMember'])->toBeFalse()
            ->and($result['member']->unit_id)->toBe($unit->id)
            ->and($result['member']->user_id)->toBe($user->id)
            ->and($result['member']->rank_id)->toBe($entryRank->id)
            ->and($result['member']->status)->toBe(UnitMemberStatus::Active);
    });

    it('uses the invite default rank when set', function () {
        Notification::fake();

        [$unit, $entryRank, $captainRank] = bootUnitForInvites();
        $invite = UnitInvite::factory()
            ->for($unit)
            ->create(['default_rank_id' => $captainRank->id]);

        $result = app(AcceptUnitInvite::class)->accept($invite, User::factory()->create());

        expect($result['member']->rank_id)->toBe($captainRank->id);
    });

    it('binds the system Member role plus any default roles', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();

        $custom = UnitRole::factory()
            ->for($unit)
            ->withPermissions(0)
            ->create(['type' => UnitRoleType::CUSTOM]);

        $invite = UnitInvite::factory()->for($unit)->create();
        $invite->defaultRoles()->attach($custom->id);

        $result = app(AcceptUnitInvite::class)->accept($invite, User::factory()->create());

        $memberRole = UnitRole::membersRole($unit);
        $boundRoleIds = $result['member']->roles()->pluck('unit_roles.id')->all();

        expect($boundRoleIds)->toContain($memberRole->id)
            ->and($boundRoleIds)->toContain($custom->id);
    });

    it('increments the uses counter exactly once', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->create();

        app(AcceptUnitInvite::class)->accept($invite, User::factory()->create());

        expect($invite->fresh()->uses)->toBe(1);
    });

    it('dispatches the welcome notification', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->create();
        $user = User::factory()->create();

        app(AcceptUnitInvite::class)->accept($invite, $user);

        Notification::assertSentTo($user, WelcomeToUnitNotification::class);
    });

    it('returns alreadyMember=true without re-creating or notifying', function () {
        Notification::fake();

        [$unit, $entryRank] = bootUnitForInvites();
        $user = User::factory()->create();
        $existingMember = UnitMember::factory()->for($unit)->for($entryRank)->for($user)->create();

        $invite = UnitInvite::factory()->for($unit)->create();

        $result = app(AcceptUnitInvite::class)->accept($invite, $user);

        expect($result['alreadyMember'])->toBeTrue()
            ->and($result['member']->id)->toBe($existingMember->id)
            ->and($invite->fresh()->uses)->toBe(0);
        Notification::assertNothingSent();
    });

    it('throws when the invite is expired', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->expired()->create();

        expect(fn () => app(AcceptUnitInvite::class)
            ->accept($invite, User::factory()->create()))
            ->toThrow(InviteNotUsableException::class);
    });

    it('throws when the invite is revoked', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->revoked()->create();

        expect(fn () => app(AcceptUnitInvite::class)
            ->accept($invite, User::factory()->create()))
            ->toThrow(InviteNotUsableException::class);
    });

    it('throws when the invite is exhausted', function () {
        Notification::fake();

        [$unit] = bootUnitForInvites();
        $invite = UnitInvite::factory()->for($unit)->exhausted(1)->create();

        expect(fn () => app(AcceptUnitInvite::class)
            ->accept($invite, User::factory()->create()))
            ->toThrow(InviteNotUsableException::class);
    });
});
