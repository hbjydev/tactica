<?php

use App\Models\Enums\UnitPermission;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitInvite;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use App\Models\User;
use App\Policies\UnitInvitePolicy;

function bootUnitWithMember(int $permissions = 0): array
{
    $unit = Unit::factory()->create();
    Unit::setCurrent($unit);
    $unit->createDefaultRoles();

    $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

    $user = User::factory()->create();
    $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

    if ($permissions > 0) {
        $role = UnitRole::factory()
            ->for($unit)
            ->withPermissions($permissions)
            ->create();
        UnitRoleBinding::create([
            'unit_role_id' => $role->id,
            'unit_member_id' => $member->id,
        ]);
    }

    return [$unit, $user, $member];
}

describe('UnitInvitePolicy', function () {
    it('allows members with MANAGE_INVITES to view, create, update, revoke, delete', function () {
        [$unit, $user] = bootUnitWithMember(UnitPermission::MANAGE_INVITES->value);
        $invite = UnitInvite::factory()->for($unit)->create();

        $this->actingAs($user);

        $policy = new UnitInvitePolicy;

        expect($policy->viewAny($user))->toBeTrue()
            ->and($policy->view($user, $invite))->toBeTrue()
            ->and($policy->create($user))->toBeTrue()
            ->and($policy->update($user, $invite))->toBeTrue()
            ->and($policy->revoke($user, $invite))->toBeTrue()
            ->and($policy->delete($user, $invite))->toBeTrue();
    });

    it('denies members without MANAGE_INVITES', function () {
        [$unit, $user] = bootUnitWithMember(0);
        $invite = UnitInvite::factory()->for($unit)->create();

        $this->actingAs($user);

        $policy = new UnitInvitePolicy;

        expect($policy->viewAny($user))->toBeFalse()
            ->and($policy->create($user))->toBeFalse()
            ->and($policy->update($user, $invite))->toBeFalse()
            ->and($policy->revoke($user, $invite))->toBeFalse()
            ->and($policy->delete($user, $invite))->toBeFalse();
    });

    it('allows ADMINISTRATOR as a wildcard', function () {
        [$unit, $user] = bootUnitWithMember(UnitPermission::ADMINISTRATOR->value);
        $invite = UnitInvite::factory()->for($unit)->create();

        $this->actingAs($user);

        $policy = new UnitInvitePolicy;

        expect($policy->create($user))->toBeTrue()
            ->and($policy->delete($user, $invite))->toBeTrue();
    });

    it('denies guests', function () {
        $unit = Unit::factory()->create();
        Unit::setCurrent($unit);
        $unit->createDefaultRoles();

        $invite = UnitInvite::factory()->for($unit)->create();

        $policy = new UnitInvitePolicy;

        expect($policy->viewAny(null))->toBeFalse()
            ->and($policy->view(null, $invite))->toBeFalse();
    });
});
