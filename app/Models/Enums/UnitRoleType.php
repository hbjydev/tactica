<?php

namespace App\Models\Enums;

enum UnitRoleType: string
{
    case ADMIN = 'admin';
    case EVERYONE = 'everyone';
    case MEMBERS = 'members';
    case CUSTOM = 'custom';

    public function isEditable(): bool
    {
        return $this !== self::ADMIN;
    }
}
