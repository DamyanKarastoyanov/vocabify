<?php

namespace App\Http\Web\Practice\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StartPracticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('enableHints')) {
            $this->merge([
                'enableHints' => filter_var($this->input('enableHints'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'itemsPerSession' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'recallDirection' => ['sometimes', 'string', 'in:target-to-native,native-to-target,mixed'],
            'mode' => ['sometimes', 'string', 'in:paper,typing'],
            'enableHints' => ['sometimes', 'boolean'],
        ];
    }

    public function getItemsPerSession(): int
    {
        return (int) ($this->input('itemsPerSession') ?? 10);
    }

    public function getRecallDirection(): string
    {
        return $this->input('recallDirection', 'mixed');
    }

    public function getMode(): string
    {
        return $this->input('mode', 'paper');
    }

    public function getEnableHints(): bool
    {
        return filter_var($this->input('enableHints', true), FILTER_VALIDATE_BOOLEAN);
    }
}
