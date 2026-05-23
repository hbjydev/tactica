<?php

namespace App\Actions\Units\Sections;

use App\Models\Section;

class DeleteSection
{
    /**
     * Update a unit member's profile with the given input data.
     */
    public function delete(Section $section): void
    {
        $section->delete();
    }
}
