<?php

namespace App\Models\Enums;

enum UnitMemberStatus: string {
    case Active = 'active';
    case Reserve = 'reserve';
    case LeaveOfAbsence = 'loa';
    case Discharged = 'discharged';
}
