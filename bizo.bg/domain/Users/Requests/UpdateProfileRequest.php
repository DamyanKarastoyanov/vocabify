<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Domain\Users\Models\User as DomainUser;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->route('user');

        /** @var DomainUser $authUser */
        $authUser = Auth::user();

        if ($authUser && $authUser->hasRole('admin')) {
            return true;
        }

        if (!$user || !$user->id || $user->id === Auth::id()) {
            return true;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // User
            'email' => 'required|email|max:255',

            // Profile
            'profile_first_name' => 'required|string|max:50',
            'profile_last_name' => 'required|string|max:50',
            'profile_latin_full_name' => 'sometimes|nullable|string|max:100',
            'profile_birth_date' => 'sometimes|nullable|date',
            'profile_personal_identification_number_type' => 'sometimes|nullable|exists:axiom_personal_identification_number_types,id',
            'profile_personal_identification_number' => 'sometimes|nullable|string|max:20',
            'profile_phone' => 'sometimes|nullable|string|max:20',
            'profile_driver_experience_years' => 'sometimes|nullable|integer|min:0|max:80',
            'profile_driver_license' => 'sometimes|nullable|string|max:50',

            // Address (selected options provided as objects with value/label)
            'address_district' => 'sometimes|nullable|exists:axiom_districts,id',
            'address_municipality' => 'sometimes|nullable|exists:axiom_municipalities,id',
            'address_town' => 'sometimes|nullable|exists:axiom_towns,id',
            'address_postcode' => 'sometimes|nullable|string|max:10',
            'address_address' => 'sometimes|nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email must not exceed 255 characters.',

            'profile_first_name.required' => 'First name is required.',
            'profile_first_name.max' => 'First name must not exceed 50 characters.',
            'profile_last_name.required' => 'Last name is required.',
            'profile_last_name.max' => 'Last name must not exceed 50 characters.',
            'profile_latin_full_name.max' => 'Latin full name must not exceed 100 characters.',
            'profile_birth_date.date' => 'Birth date must be a valid date.',
            'profile_personal_identification_number_type.required' => 'Personal identification number type is required.',
            'profile_personal_identification_number_type.exists' => 'Selected personal identification number type is invalid.',
            'profile_personal_identification_number.required' => 'Personal identification number is required.',
            'profile_personal_identification_number.max' => 'Personal identification number must not exceed 20 characters.',
            'profile_phone.max' => 'Phone must not exceed 20 characters.',

            'address_district.required' => 'District is required.',
            'address_district.exists' => 'Selected district is invalid.',
            'address_municipality.required' => 'Municipality is required.',
            'address_municipality.exists' => 'Selected municipality is invalid.',
            'address_town.required' => 'Town is required.',
            'address_town.exists' => 'Selected town is invalid.',
            'address_postcode.required' => 'Postcode is required.',
            'address_postcode.max' => 'Postcode must not exceed 10 characters.',
            'address_address.required' => 'Address is required.',
            'address_address.max' => 'Address must not exceed 255 characters.',
        ];
    }
}


