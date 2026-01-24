<?php

namespace App\Http\Web\Practice\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnswerWordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'result' => ['required', 'string', 'in:correct,incorrect,skipped'],
        ];
    }

    public function getResult(): string
    {
        return $this->input('result');
    }
}
