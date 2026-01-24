<?php

namespace Domain\Broqee\MTPLInsurance\Requests;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsuranceOffer;
use Domain\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class BroqeeMTPLInsuranceCreatePolicyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $offer = BroqeeMTPLInsuranceOffer::findOrFail( $this->input('offer_id'));
        if($offer->status != 2 || $offer->broqee_order_number === null || $offer->user_id === User::SYSTEM_USER_ID) {
            return false;
        }

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
            'offer_id' => 'required|integer|min:1',
        ];
    }
}
