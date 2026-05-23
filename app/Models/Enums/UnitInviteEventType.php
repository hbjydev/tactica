<?php

namespace App\Models\Enums;

enum UnitInviteEventType: string
{
    case VIEWED = 'viewed';
    case ACCEPTED = 'accepted';
    case ALREADY_MEMBER = 'already_member';
    case REJECTED = 'rejected';
}
