<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\UnitMember;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class MembersController extends Controller
{
    public function list(Unit $unit)
    {
        /** @var LengthAwarePaginator<int, UnitMember> $members */
        $members = $unit
            ->members()
            ->with('user', 'rank', 'serviceRecords', 'unit:id,slug')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('units/members/list', [
            'members' => $members,
        ]);
    }

    public function show(Unit $unit, UnitMember $member)
    {
        return Inertia::render('units/members/show', [
            'member' => $member->load('rank', 'user'),
        ]);
    }
}
