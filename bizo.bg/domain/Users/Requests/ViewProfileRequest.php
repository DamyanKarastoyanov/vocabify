<?php

namespace Domain\Users\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ViewProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->route('user');

        if(Auth::user()->hasRole('admin')) {
            return true; // admin can edit any profile
        }

        // Allow if no specific user is targeted or user is editing their own profile
        if(!$user || !$user->id || $user->id === Auth::id()) {
            return true; // user editing own profile
        }

        return false;
    }
}
