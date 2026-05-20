<?php

use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\LegalController;
use App\Http\Controllers\Units\UnitsController;
use Illuminate\Support\Facades\Route;

Route::domain(config('app.domain'))
    ->name('public.')
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');
        Route::get('/terms', [LegalController::class, 'terms'])->name('legal.terms');
        Route::get('/privacy', [LegalController::class, 'privacy'])->name('legal.privacy');

        Route::middleware(['auth'])->group(function () {
        Route::get('/unit-wizard', [UnitsController::class, 'create'])->name('unit.create');
        Route::post('/unit-wizard', [UnitsController::class, 'store'])->name('unit.store');
        });
    });

Route::domain('sso.' . config('app.domain'))
    ->name('sso.')
    ->group(function () {
        Route::get('/', function () {
            return auth()->check()
                ? redirect('/settings/profile')
                : redirect('/login');
        })->name('home');

        require __DIR__.'/settings.php';
    });

Route::domain('{unit:slug}.' . config('app.domain'))
    ->name('unit.')
    ->group(function () {
        require __DIR__.'/unit.php';
    });
