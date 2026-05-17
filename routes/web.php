<?php

use App\Http\Controllers\Units\UnitsController;
use Illuminate\Support\Facades\Route;

Route::domain(config('app.domain'))
    ->name('public.')
    ->group(function () {
        Route::get('/unit-wizard', [UnitsController::class, 'create'])->name('unit.create');
        Route::post('/unit-wizard', [UnitsController::class, 'store'])->name('unit.store');
    });

Route::domain('sso.' . config('app.domain'))
    ->name('sso.')
    ->group(function () {
        require __DIR__.'/settings.php';
    });

Route::domain('{unit:slug}.' . config('app.domain'))
    ->name('unit.')
    ->group(function () {
        require __DIR__.'/unit.php';
    });
