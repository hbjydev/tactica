<?php

use App\Http\Controllers\Units\DashboardController;
use App\Http\Controllers\Units\MembersController;
use App\Http\Controllers\Units\RanksController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'show'])->name('dashboard');

Route::prefix('/ranks')
    ->name('ranks.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [RanksController::class, 'list'])->name('list');

        Route::get('/create', [RanksController::class, 'create'])->name('create');
        Route::post('/', [RanksController::class, 'store'])->name('store');

        Route::get('/{rank}/edit', [RanksController::class, 'edit'])->name('edit');
        Route::patch('/{rank}', [RanksController::class, 'update'])->name('update');

        Route::delete('/{rank}', [RanksController::class, 'destroy'])->name('destroy');
    });

Route::prefix('/members')
    ->name('members.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [MembersController::class, 'list'])->name('list');
        Route::get('/{member}', [MembersController::class, 'show'])->name('show');

        Route::get('/{member}/edit', [MembersController::class, 'edit'])->name('edit');
        Route::patch('/{member}', [MembersController::class, 'update'])->name('update');

        Route::delete('/{member}', [MembersController::class, 'destroy'])->name('destroy');
    });
