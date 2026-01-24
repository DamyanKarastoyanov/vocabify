<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckInspectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'registration_number' => ['required', 'string', 'max:10'],
            'captcha_code' => ['required', 'string'],
            'captcha_session' => ['required', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'registration_number.required' => 'Регистрационният номер е задължителен.',
            'registration_number.max' => 'Регистрационният номер не може да бъде повече от 10 символа.',
            'captcha_code.required' => 'Кодът за сигурност е задължителен.',
            'captcha_session.required' => 'Сесията за captcha е задължителна.',
        ];
    }
}
