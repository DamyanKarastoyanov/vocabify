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
            'shown_side' => ['sometimes', 'nullable', 'string', 'max:50'],
            'response_ms' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ];
    }

    public function getResult(): string
    {
        return $this->input('result');
    }

    public function getShownSide(): ?string
    {
        return $this->filled('shown_side') ? $this->input('shown_side') : null;
    }

    public function getResponseMs(): ?int
    {
        $value = $this->input('response_ms');
        return $value !== null && $value !== '' ? (int) $value : null;
    }
}
