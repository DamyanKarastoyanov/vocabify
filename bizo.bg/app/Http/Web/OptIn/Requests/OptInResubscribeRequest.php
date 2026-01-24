<?php

namespace App\Http\Web\OptIn\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OptInResubscribeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|email',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Имейлът е задължителен.',
            'email.email' => 'Имейлът трябва да е валиден имейл адрес.',
        ];
    }
}