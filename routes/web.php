<?php

use App\Http\Controllers\Units\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::domain('{unit:slug}.'.config('app.domain'))
    ->group(function () {
        Route::get('/', [DashboardController::class, 'show'])->name('dashboard');
    })
    ->name('unit.');

require __DIR__.'/settings.php';
