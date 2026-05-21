<?php

use App\Http\Controllers\Home\UnitWizardController;
use App\Http\Middleware\ShareUnitData;
use Illuminate\Support\Facades\Route;

Route::domain(config('app.domain'))
    ->name('home.')
    ->group(function () {
        Route::inertia('/', 'public/index')->name('home');

        Route::name('legal.')->group(function () {
            Route::inertia('/terms', 'public/terms')->name('terms');
            Route::inertia('/privacy', 'public/privacy')->name('privacy');
        });

        Route::middleware(['auth', 'verified'])->group(function () {
            Route::get('/unit-wizard', [UnitWizardController::class, 'create'])->name('unit.create');
            Route::post('/unit-wizard', [UnitWizardController::class, 'store'])->name('unit.store');
        });
    });

Route::domain('sso.'.config('app.domain'))
    ->name('sso.')
    ->group(function () {
        require __DIR__.'/settings.php';
    });

Route::domain('{unit:slug}.'.config('app.domain'))
    ->name('unit.')
    ->middleware([ShareUnitData::class])
    ->group(function () {
        require __DIR__.'/unit.php';
    });
