<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('sso.home'));
    $response->assertRedirect(route('login'));
});

test('authenticated users are redirected to their profile', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('sso.home'));
    $response->assertRedirect('/settings/profile');
});