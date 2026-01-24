<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetAddressDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $address = $this->route('address');

        return $address ? Auth::user()->can('view', $address) : true;
    }
}
