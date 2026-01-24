<?php

namespace Domain\Insurance\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetPolicyDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $policy = $this->route('policy');

        return Auth::user()->can('view', $policy);
    }
}
