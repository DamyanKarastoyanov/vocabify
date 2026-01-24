<?php

namespace Domain\Payment\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class DebitNoteDownloadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (request()->hasValidSignature()) {
            return true; // Guest via signed URL
        }

        $user = Auth::user();

        if(!$user) {
            return false; // Not authenticated
        }

        $debitNote = $this->route('debitNote');
        $installment = $debitNote->installment;

        return $user->hasRole('admin') || $user->can('view', $installment);
    }
}
