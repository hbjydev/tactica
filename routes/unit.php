<?php

use App\Http\Controllers\Units\DashboardController;
use App\Http\Controllers\Units\InviteAcceptanceController;
use App\Http\Controllers\Units\InvitesController;
use App\Http\Controllers\Units\MembersController;
use App\Http\Controllers\Units\RanksController;
use App\Http\Controllers\Units\RolesController;
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

Route::prefix('/roles')
    ->name('roles.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [RolesController::class, 'list'])->name('list');

        Route::post('/', [RolesController::class, 'store'])->name('store');

        Route::patch('/{role}', [RolesController::class, 'update'])->name('update');
        Route::delete('/{role}', [RolesController::class, 'destroy'])->name('destroy');

        Route::patch('/{role}/permissions', [RolesController::class, 'updatePermissions'])->name('updatePermissions');

        Route::post('/{role}/bindings', [RolesController::class, 'addBinding'])->name('addBinding');
        Route::delete('/{role}/bindings/{member}', [RolesController::class, 'removeBinding'])->name('removeBinding');
    });

Route::prefix('/invites')
    ->name('invites.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [InvitesController::class, 'list'])->name('list');
        Route::get('/{invite}', [InvitesController::class, 'show'])->name('show');
        Route::post('/', [InvitesController::class, 'store'])->name('store');
        Route::patch('/{invite}', [InvitesController::class, 'update'])->name('update');
        Route::post('/{invite}/revoke', [InvitesController::class, 'revoke'])->name('revoke');
        Route::delete('/{invite}', [InvitesController::class, 'destroy'])->name('destroy');
    });

// Public invite-acceptance endpoint. The unit subdomain has no auth middleware,
// so this slots in like any other route.
Route::get('/invite/{token}', [InviteAcceptanceController::class, 'show'])
    ->name('invite.show');
