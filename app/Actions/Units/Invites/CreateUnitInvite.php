<?php

namespace App\Actions\Units\Invites;

use App\Models\Unit;
use App\Models\UnitInvite;
use App\Models\UnitMember;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CreateUnitInvite
{
    public function create(Unit $unit, ?UnitMember $createdBy, array $input): UnitInvite
    {
        if ($createdBy !== null && $createdBy->unit_id !== $unit->id) {
            throw new AuthorizationException(
                'Invite creator must be a member of the target unit.',
            );
        }

        $validated = Validator::make($input, [
            'notes' => ['nullable', 'string', 'max:255'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'default_rank_id' => [
                'nullable',
                'string',
                Rule::exists('ranks', 'id')->where('unit_id', $unit->id),
            ],
            'default_role_ids' => ['nullable', 'array'],
            'default_role_ids.*' => [
                'string',
                Rule::exists('unit_roles', 'id')->where('unit_id', $unit->id),
            ],
            'member_id' => [
                'nullable',
                'string',
                Rule::exists('unit_members', 'id')
                    ->where('unit_id', $unit->id)
                    ->whereNull('user_id'),
            ],
        ])->validate();

        return DB::transaction(function () use ($unit, $createdBy, $validated) {
            $invite = UnitInvite::create([
                'unit_id' => $unit->id,
                'token' => $this->generateToken(),
                'created_by_member_id' => $createdBy?->id,
                'member_id' => $validated['member_id'] ?? null,
                'default_rank_id' => $validated['default_rank_id'] ?? null,
                'expires_at' => $validated['expires_at'] ?? null,
                'max_uses' => $validated['max_uses'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            if (! empty($validated['default_role_ids'])) {
                $invite->defaultRoles()->sync($validated['default_role_ids']);
            }

            return $invite->fresh(['defaultRank', 'defaultRoles', 'createdByMember.user', 'member']);
        });
    }

    private function generateToken(): string
    {
        do {
            $token = Str::random(40);
        } while (UnitInvite::where('token', $token)->exists());

        return $token;
    }
}
