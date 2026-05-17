<?php

use App\Http\Controllers\Units\DashboardController;
use App\Http\Controllers\Units\RanksController;
use App\Http\Controllers\Units\MembersController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'show'])->name('dashboard');

Route::prefix('/ranks')
    ->name('ranks.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [RanksController::class, 'list'])->name('list');
    })
    ->scopeBindings();

Route::prefix('/members')
    ->name('members.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [MembersController::class, 'list'])->name('list');
        Route::get('/{member}', [MembersController::class, 'show'])->name('show');
    });
