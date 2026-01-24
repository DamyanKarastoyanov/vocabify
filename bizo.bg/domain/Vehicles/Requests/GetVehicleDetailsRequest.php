<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GetVehicleDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        if (!$vehicle) {
            return true;
        }

        return Auth::user()->can('view', $vehicle);
    }
}
