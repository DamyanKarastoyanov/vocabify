<?php

namespace App\Http\Web\OptIn\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OptInRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'optIn' => 'required|boolean',
            'reg_number' => 'required|string',
            'serviceType' => 'nullable|string',
            'results' => 'nullable|array',
        ];
    }
}
