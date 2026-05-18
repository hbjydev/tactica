<?php

namespace App\Http\Requests\Units\Ranks;

use Illuminate\Foundation\Http\FormRequest;

class CreateRankRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'abbreviation' => ['required', 'string', 'max:8'],
        ];
    }
}
