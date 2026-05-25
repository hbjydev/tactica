<?php

namespace App\Models\Enums;

enum ServiceRecordEntryType: string
{
    case Promotion = 'promotion';
    case Demotion = 'demotion';
    case Award = 'award';
    case DisciplinaryAction = 'disciplinary_action';
    case Note = 'note';
    case Assignment = 'assignment';
}
