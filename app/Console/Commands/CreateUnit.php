<?php

namespace App\Console\Commands;

use App\Actions\Units\CreateNewUnit;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('tactica:create-unit {slug} {display_name} {owner_id}')]
#[Description('Create a new unit')]
class CreateUnit extends Command
{
    public function __construct(
        protected CreateNewUnit $action,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::firstOrFail($this->argument('owner_id'));

        $unit = $this->action->create($user, [
            'slug' => $this->argument('slug'),
            'display_name' => $this->argument('display_name'),
        ]);

        $this->info('Unit created successfully.');
        $this->info('-> https://'.$unit->slug.'.'.config('app.domain'));
    }
}
