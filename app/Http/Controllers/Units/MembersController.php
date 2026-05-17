<?php

namespace App\Http\Controllers\Units;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Models\UnitMember;
use Inertia\Inertia;

class MembersController extends Controller
{
    public function list(Unit $unit)
    {
        return Inertia::render('units/members/list', [
            'members' => $unit
                ->members()
                ->with('user', 'rank', 'serviceRecords', 'unit:id,slug')
                ->orderBy('created_at', 'desc')
                ->paginate(15),
        ]);
    }

    public function show(Unit $unit, UnitMember $member)
    {
        return Inertia::render('units/members/show', [
            'member' => $member->load('rank', 'user'),
        ]);
    }
}
