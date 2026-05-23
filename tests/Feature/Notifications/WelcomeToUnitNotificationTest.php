<?php

use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use App\Models\User;
use App\Notifications\WelcomeToUnitNotification;

describe('WelcomeToUnitNotification', function () {
    it('builds a mail message with profile and ranks links', function () {
        $unit = Unit::factory()->create(['display_name' => 'Bravo Company', 'slug' => 'bravo']);
        $rank = Rank::factory()->for($unit)->create(['ord' => 0]);
        $user = User::factory()->create();
        $member = UnitMember::factory()
            ->for($unit)
            ->for($rank)
            ->for($user)
            ->create(['display_name' => 'Hayden']);

        $notification = new WelcomeToUnitNotification($unit, $member);
        $mail = $notification->toMail($user);

        expect($mail->subject)->toBe('Welcome to Bravo Company');
        expect($mail->greeting)->toContain('Hayden');
        expect($mail->actionUrl)->toContain('/members/'.$member->id);

        $body = implode("\n", array_merge($mail->introLines, $mail->outroLines));
        expect($body)->toContain('/ranks');
    });
});
