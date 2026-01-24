<?php

namespace Domain\Insurance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePolicyStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->hasRole('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'policy_status_id' => 'required|numeric|exists:policy_statuses,id',
            'axiom_policy_status_id' => 'required|numeric|exists:axiom_policy_statuses,id',
        ];

        return $rules;
    }

    public function messages()
    {
        return [
            'policy_status_id.required' => 'Policy status is required.',
            'policy_status_id.numeric' => 'Policy status must be a number.',
            'policy_status_id.exists' => 'The selected policy status is invalid.',
            'axiom_policy_status_id.required' => 'Axiom policy status is required.',
            'axiom_policy_status_id.numeric' => 'Axiom policy status must be a number.',
            'axiom_policy_status_id.exists' => 'The selected axiom policy status is invalid.',
        ];
    }
}
