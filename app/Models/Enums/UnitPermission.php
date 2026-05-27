<?php

namespace App\Models\Enums;

enum UnitPermission: int
{
    case NONE = 0;

    case VIEW_UNIT = 1 << 0;

    case ADMINISTRATOR = 1 << 1;
    case MANAGE_ROLES = 1 << 2;

    case MANAGE_MEMBERS = 1 << 3;
    case MANAGE_RANKS = 1 << 4;
    case MANAGE_INVITES = 1 << 5;
    case MANAGE_SECTIONS = 1 << 6;

    case MANAGE_UNIT_PROFILE = 1 << 7;
}
