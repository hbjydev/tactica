<?php

test('returns a successful response', function () {
    $response = $this->get(route('public.home'));

    $response->assertOk();
});
