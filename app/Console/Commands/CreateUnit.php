<?php

namespace App\Console\Commands;

use App\Models\Rank;
use App\Models\Unit;
use App\Models\UnitMember;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('tactica:create-unit {slug} {display_name} {owner_id}')]
#[Description('Create a new unit')]
class CreateUnit extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $unit = Unit::create([
            'slug' => $this->argument('slug'),
            'display_name' => $this->argument('display_name'),
        ]);

        Rank::create([
            'unit_id' => $unit->id,
            'display_name' => 'Private',
            'abbreviation' => 'Pvt.',
        ]);

        Rank::create([
            'unit_id' => $unit->id,
            'display_name' => 'Sergeant',
            'abbreviation' => 'Sgt.',
        ]);

        $captain = Rank::create([
            'unit_id' => $unit->id,
            'display_name' => 'Captain',
            'abbreviation' => 'Cpt.',
        ]);

        UnitMember::create([
            'unit_id' => $unit->id,
            'user_id' => $this->argument('owner_id'),
            'rank_id' => $captain->id,
            'display_name' => 'Admin',
        ]);
    }
}
