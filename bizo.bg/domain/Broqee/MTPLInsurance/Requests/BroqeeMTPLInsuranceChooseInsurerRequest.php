<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class BroqeeMTPLInsuranceChooseInsurerRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'offer' => 'required|integer|min:1',
        ];
    }
}
