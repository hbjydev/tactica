<?php

namespace App\Actions\Units\Invites;

use App\Actions\Units\Members\CreateNewUnitMember;
use App\Models\Enums\UnitMemberStatus;
use App\Models\Rank;
use App\Models\UnitInvite;
use App\Models\UnitMember;
use App\Models\UnitRole;
use App\Models\UnitRoleBinding;
use App\Models\User;
use App\Notifications\WelcomeToUnitNotification;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AcceptUnitInvite
{
    public function __construct(
        private CreateNewUnitMember $createMember,
    ) {}

    /**
     * @return array{member: UnitMember, alreadyMember: bool}
     */
    public function accept(UnitInvite $invite, User $user): array
    {
        return DB::transaction(function () use ($invite, $user) {
            /** @var UnitInvite $locked */
            $locked = UnitInvite::query()
                ->whereKey($invite->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (! $locked->isUsable()) {
                throw new InviteNotUsableException;
            }

            $unit = $locked->unit;

            $existing = UnitMember::query()
                ->where('unit_id', $unit->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing !== null) {
                return ['member' => $existing, 'alreadyMember' => true];
            }

            $rankId = $locked->default_rank_id ?? Rank::query()
                ->where('unit_id', $unit->id)
                ->orderBy('ord')
                ->value('id');

            if ($rankId === null) {
                throw new RuntimeException(
                    "Cannot accept invite: unit {$unit->id} has no ranks defined.",
                );
            }

            $member = $this->createMember->create($unit, $user, [
                'display_name' => $user->display_name,
                'rank_id' => $rankId,
                'status' => UnitMemberStatus::Active->value,
            ]);

            $roleIds = collect()
                ->push(UnitRole::membersRole($unit)->id)
                ->merge($locked->defaultRoles()->pluck('unit_roles.id'))
                ->unique()
                ->values();

            foreach ($roleIds as $roleId) {
                UnitRoleBinding::firstOrCreate([
                    'unit_role_id' => $roleId,
                    'unit_member_id' => $member->id,
                ]);
            }

            $locked->increment('uses');

            $user->notify(new WelcomeToUnitNotification($unit, $member));

            return ['member' => $member, 'alreadyMember' => false];
        });
    }
}
