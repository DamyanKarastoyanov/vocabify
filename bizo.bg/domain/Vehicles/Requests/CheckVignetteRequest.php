<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckVignetteRequest extends FormRequest
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
            'vehicle' => ['nullable', 'integer'],
            'registration_number' => ['required', 'string', 'max:10'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'vehicle.integer' => 'Автомобилът трябва да бъде валиден.',
            'registration_number.required' => 'Регистрационният номер е задължителен.',
            'registration_number.max' => 'Регистрационният номер не може да бъде повече от 10 символа.',
        ];
    }
}

