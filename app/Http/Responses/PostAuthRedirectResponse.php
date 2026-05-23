<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse;
use Laravel\Fortify\Contracts\RegisterResponse;
use Symfony\Component\HttpFoundation\Response;

class PostAuthRedirectResponse implements LoginResponse, RegisterResponse
{
    public function toResponse($request): Response
    {
        return $this->resolve($request);
    }

    protected function resolve(Request $request): Response
    {
        $pending = $request->session()->pull('pending_invite');
        if (is_array($pending) && isset($pending['unit'], $pending['token'])) {
            $request->session()->forget('url.intended');

            return Inertia::location(route('unit.invite.show', [
                'unit' => $pending['unit'],
                'token' => $pending['token'],
            ]));
        }

        $user = $request->user();

        if ($user && $unit = $user->units()->first()) {
            return Inertia::location(route('unit.dashboard', ['unit' => $unit->slug]));
        }

        return Inertia::location(route('home.unit.create'));
    }
}
