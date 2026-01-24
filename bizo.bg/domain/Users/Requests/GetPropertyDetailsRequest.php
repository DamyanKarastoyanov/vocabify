<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetPropertyDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $property = $this->route('property');

        return $property ? Auth::user()->can('view', $property) : true;
    }
}
