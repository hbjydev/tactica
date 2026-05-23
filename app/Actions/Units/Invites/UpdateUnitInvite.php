<?php

namespace App\Actions\Units\Invites;

use App\Models\UnitInvite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UpdateUnitInvite
{
    public function update(UnitInvite $invite, array $input): UnitInvite
    {
        $unitId = $invite->unit_id;

        $validated = Validator::make($input, [
            'notes' => ['nullable', 'string', 'max:255'],
            'expires_at' => ['nullable', 'date'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'default_rank_id' => [
                'nullable',
                'string',
                Rule::exists('ranks', 'id')->where('unit_id', $unitId),
            ],
            'default_role_ids' => ['nullable', 'array'],
            'default_role_ids.*' => [
                'string',
                Rule::exists('unit_roles', 'id')->where('unit_id', $unitId),
            ],
        ])->validate();

        return DB::transaction(function () use ($invite, $validated) {
            $updateData = [];
            foreach (['notes', 'expires_at', 'max_uses', 'default_rank_id'] as $key) {
                if (array_key_exists($key, $validated)) {
                    $updateData[$key] = $validated[$key];
                }
            }

            if (! empty($updateData)) {
                $invite->update($updateData);
            }

            if (array_key_exists('default_role_ids', $validated)) {
                $invite->defaultRoles()->sync($validated['default_role_ids'] ?? []);
            }

            return $invite->fresh(['defaultRank', 'defaultRoles', 'createdByMember.user']);
        });
    }
}
