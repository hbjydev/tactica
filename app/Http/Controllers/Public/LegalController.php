<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('public/terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('public/privacy');
    }
}
