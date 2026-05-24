<?php

use App\Models\Enums\UnitPermission;
use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use App\Models\User;
use App\Policies\UnitMemberPolicy;

describe('UnitMemberPolicy', function () {
    describe('create', function () {
        it('denies a member without MANAGE_MEMBERS from creating members', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
            $user = User::factory()->create();
            UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->create($user))->toBeFalse();
        });

        it('allows a member with MANAGE_MEMBERS to create members', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
            $user = User::factory()->create();
            $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $role = UnitRole::factory()
                ->for($unit)
                ->withPermissions(UnitPermission::MANAGE_MEMBERS->value)
                ->create();
            UnitRoleBinding::create([
                'unit_role_id' => $role->id,
                'unit_member_id' => $member->id,
            ]);

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->create($user))->toBeTrue();
        });
    });

    describe('update', function () {
        it('allows a member to update their own profile', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
            $user = User::factory()->create();
            $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->update($user, $member))->toBeTrue();
        });

        it('denies a member without permissions from updating another member', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

            $user = User::factory()->create();
            UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $otherUser = User::factory()->create();
            $otherMember = UnitMember::factory()->for($unit)->for($rank)->for($otherUser)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->update($user, $otherMember))->toBeFalse();
        });

        it('allows a member with MANAGE_MEMBERS to update any member', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

            $user = User::factory()->create();
            $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $role = UnitRole::factory()
                ->for($unit)
                ->withPermissions(UnitPermission::MANAGE_MEMBERS->value)
                ->create();
            UnitRoleBinding::create([
                'unit_role_id' => $role->id,
                'unit_member_id' => $member->id,
            ]);

            $otherUser = User::factory()->create();
            $otherMember = UnitMember::factory()->for($unit)->for($rank)->for($otherUser)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->update($user, $otherMember))->toBeTrue();
        });
    });

    describe('changeRank', function () {
        it('denies a member from changing their own rank', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);
            $user = User::factory()->create();
            $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->changeRank($user, $member))->toBeFalse();
        });

        it('denies a member without permissions from changing another member\'s rank', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

            $user = User::factory()->create();
            UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $otherUser = User::factory()->create();
            $otherMember = UnitMember::factory()->for($unit)->for($rank)->for($otherUser)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->changeRank($user, $otherMember))->toBeFalse();
        });

        it('allows a member with MANAGE_MEMBERS to change rank', function () {
            $unit = Unit::factory()->create();
            Unit::setCurrent($unit);

            $rank = Rank::factory()->for($unit)->create(['abbreviation' => 'Pvt', 'ord' => 0]);

            $user = User::factory()->create();
            $member = UnitMember::factory()->for($unit)->for($rank)->for($user)->create();

            $role = UnitRole::factory()
                ->for($unit)
                ->withPermissions(UnitPermission::MANAGE_MEMBERS->value)
                ->create();
            UnitRoleBinding::create([
                'unit_role_id' => $role->id,
                'unit_member_id' => $member->id,
            ]);

            $otherUser = User::factory()->create();
            $otherMember = UnitMember::factory()->for($unit)->for($rank)->for($otherUser)->create();

            $this->actingAs($user);

            expect((new UnitMemberPolicy)->changeRank($user, $otherMember))->toBeTrue();
        });
    });
});
