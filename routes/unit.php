<?php

use App\Http\Controllers\Units\DashboardController;
use App\Http\Controllers\Units\InviteAcceptanceController;
use App\Http\Controllers\Units\Settings\InvitesController;
use App\Http\Controllers\Units\MembersController;
use App\Http\Controllers\Units\OrbatController;
use App\Http\Controllers\Units\RanksController;
use App\Http\Controllers\Units\Settings\RolesController;
use App\Http\Controllers\Units\SectionsController;
use App\Http\Controllers\Units\Settings\BrandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'show'])->name('dashboard');

Route::prefix('/ranks')
    ->name('ranks.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [RanksController::class, 'list'])
            ->name('list')
            ->middleware('can:VIEW_UNIT');

        Route::middleware('can:MANAGE_RANKS')->group(function () {
            Route::get('/create', [RanksController::class, 'create'])
                ->name('create');

            Route::post('/', [RanksController::class, 'store'])
                ->name('store');

            Route::get('/{rank}/edit', [RanksController::class, 'edit'])
                ->name('edit');

            Route::patch('/{rank}', [RanksController::class, 'update'])
                ->name('update');

            Route::delete('/{rank}', [RanksController::class, 'destroy'])
                ->name('destroy');
        });
    });

Route::prefix('/members')
    ->name('members.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [MembersController::class, 'list'])->name('list');
        Route::get('/search', [MembersController::class, 'search'])->name('search');

        Route::middleware('can:MANAGE_MEMBERS')->group(function () {
            Route::get('/create', [MembersController::class, 'create'])->name('create');
            Route::post('/', [MembersController::class, 'store'])->name('store');

            Route::get('/{member}/edit', [MembersController::class, 'edit'])->name('edit');
            Route::patch('/{member}', [MembersController::class, 'update'])->name('update');

            Route::delete('/{member}', [MembersController::class, 'destroy'])->name('destroy');
        });

        Route::get('/{member}', [MembersController::class, 'show'])->name('show');
    });

Route::prefix('/roles')
    ->name('roles.')
    ->scopeBindings()
    ->middleware('can:MANAGE_ROLES')
    ->group(function () {
        Route::get('/', [RolesController::class, 'list'])->name('list');

        Route::post('/', [RolesController::class, 'store'])->name('store');

        Route::patch('/{role}', [RolesController::class, 'update'])->name('update');
        Route::delete('/{role}', [RolesController::class, 'destroy'])->name('destroy');

        Route::patch('/{role}/permissions', [RolesController::class, 'updatePermissions'])->name('updatePermissions');

        Route::post('/{role}/bindings', [RolesController::class, 'addBinding'])->name('addBinding');
        Route::delete('/{role}/bindings/{member}', [RolesController::class, 'removeBinding'])->name('removeBinding');
    });

Route::prefix('/structure')
    ->name('structure.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/orbat', OrbatController::class)->name('orbat');

        Route::prefix('/sections')
            ->name('sections.')
            ->scopeBindings()
            ->group(function () {
                Route::get('/', [SectionsController::class, 'list'])->name('list');
                Route::middleware('can:MANAGE_SECTIONS')->group(function () {
                    Route::get('/create', [SectionsController::class, 'create'])->name('create');
                    Route::post('/', [SectionsController::class, 'store'])->name('store');
                    Route::post('/{section}/slots', [SectionsController::class, 'storeSlot'])->name('slot.store');
                    Route::patch('/{section}/slots/{slot}', [SectionsController::class, 'updateSlot'])->name('slot.update');
                    Route::delete('/{section}/slots/{slot}', [SectionsController::class, 'destroySlot'])->name('slot.destroy');
                    Route::get('/{section}/edit', [SectionsController::class, 'edit'])->name('edit');
                    Route::patch('/{section}', [SectionsController::class, 'update'])->name('update');
                    Route::delete('/{section}', [SectionsController::class, 'destroy'])->name('destroy');
                });
                Route::get('/{section}', [SectionsController::class, 'show'])->name('show');
            });
    });

Route::prefix('/invites')
    ->name('invites.')
    ->scopeBindings()
    ->middleware('can:MANAGE_INVITES')
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
    ->withoutMiddleware('can:VIEW_UNIT')
    ->name('invite.show');

Route::prefix('/branding')
    ->name('branding.')
    ->scopeBindings()
    ->middleware('can:MANAGE_UNIT_PROFILE')
    ->group(function () {
        Route::get('/', [BrandingController::class, 'show'])->name('show');
        Route::post('/', [BrandingController::class, 'update'])->name('update');
    });
