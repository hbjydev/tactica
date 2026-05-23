<?php

namespace App\Actions\Units\Invites;

use RuntimeException;

class InviteNotUsableException extends RuntimeException
{
    public function __construct(string $message = 'This invite is no longer usable.')
    {
        parent::__construct($message);
    }
}
