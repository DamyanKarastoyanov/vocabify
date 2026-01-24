<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckMVRFinesRequest extends FormRequest
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
            'egn' => ['required', 'string', 'size:10'],
            'driving_licence_number' => ['required', 'string', 'max:20'],
            'profile_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'egn.required' => 'ЕГН е задължително.',
            'egn.size' => 'ЕГН трябва да бъде точно 10 символа.',
            'driving_licence_number.required' => 'Номерът на шофьорската книжка е задължителен.',
            'driving_licence_number.max' => 'Номерът на шофьорската книжка не може да бъде повече от 20 символа.',
        ];
    }
}

