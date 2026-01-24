<?php

namespace App\Http\Web\OptIn\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OptInUnsubscribeSuccessRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'unsubscribedUserId' => 'required|integer|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'unsubscribedUserId.required' => 'Идентификаторът на отписал се потребител е задължителен.',
            'unsubscribedUserId.integer' => 'Идентификаторът на отписал се потребител трябва да е цяло число.',
            'unsubscribedUserId.exists' => 'Идентификаторът на отписал се потребител не съществува.',
        ];
    }
}