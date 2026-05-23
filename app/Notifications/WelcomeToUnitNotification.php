<?php

namespace App\Notifications;

use App\Models\Unit;
use App\Models\UnitMember;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeToUnitNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Unit $unit,
        public UnitMember $member,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $profileUrl = route('unit.members.show', [
            'unit' => $this->unit->slug,
            'member' => $this->member->id,
        ]);

        $ranksUrl = route('unit.ranks.list', [
            'unit' => $this->unit->slug,
        ]);

        return (new MailMessage)
            ->subject("Welcome to {$this->unit->display_name}")
            ->greeting("Welcome, {$this->member->display_name}!")
            ->line("You've successfully joined **{$this->unit->display_name}**.")
            ->line('Head over to your profile to fill in the basics and get oriented:')
            ->action('View your profile', $profileUrl)
            ->line("When you're ready, take a look at how the unit is organised — the ranks list is a good starting point: [{$ranksUrl}]({$ranksUrl})")
            ->line('Welcome aboard.');
    }
}
