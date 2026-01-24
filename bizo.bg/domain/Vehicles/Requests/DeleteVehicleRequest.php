<?php

namespace Domain\Vehicles\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class DeleteVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $vehicle = $this->route('vehicle');

        return Auth::user()->can('delete', $vehicle);
    }
}

