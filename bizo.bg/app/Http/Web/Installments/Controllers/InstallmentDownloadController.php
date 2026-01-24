<?php

namespace App\Http\Web\Installments\Controllers;

use Domain\Payment\Actions\GenerateAndStoreDebitNoteAction;
use Domain\Payment\Models\Installment;
use Domain\Payment\Requests\InstallmentDownloadRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;

class InstallmentDownloadController
{
    public function __invoke(
        InstallmentDownloadRequest $request,
        Installment $installment,
        GenerateAndStoreDebitNoteAction $generateAndStoreDebitNoteAction
    ): RedirectResponse {
        $debitNote = $installment->debitNote;

        if (!$debitNote) {
            $debitNote = $generateAndStoreDebitNoteAction->handle($installment);

            if (!$debitNote) {
                abort(404, 'Debit note could not be generated.');
            }
        }

        if (request()->hasValidSignature()) {
            $url = URL::temporarySignedRoute(
                'debit-note.download',
                now()->addMinutes(1),
                ['debitNote' => $debitNote]
            );
        } else {
            $url = route('debit-note.download', ['debitNote' => $debitNote]);
        }

        return redirect($url);
    }
}


