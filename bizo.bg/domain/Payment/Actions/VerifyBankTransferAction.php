<?php

namespace Domain\Payment\Actions;

use Domain\Insurance\Events\PolicyIssuedEvent;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\PaymentStatus;
use Illuminate\Support\Facades\Auth;
use Domain\Payment\Actions\NotifyBankTransferSuccessAction;
use Domain\Payment\Jobs\GenerateInstallmentDebitNoteJob;

class VerifyBankTransferAction
{
    public function __construct(protected NotifyBankTransferSuccessAction $notifyBankTransferSuccessAction)
    {
        //
    }

    public function handle(BankTransfer $bank_transfer): BankTransfer
    {
        $bank_transfer->payment_status_id = PaymentStatus::STATUSES['VERIFIED'];
        $bank_transfer->verified_at = now();
        $bank_transfer->verified_by = Auth::id();
        $bank_transfer->save();

        $policy = $bank_transfer->installment->policy;
        if($policy->policy_status_id === null || $policy->policy_status_id === PolicyStatus::STATUSES['AWAITING_PAYMENT_CONFIRMATION']) {
            $policy->policy_status_id = PolicyStatus::STATUSES['ACTIVE'];
            $policy->save();

            PolicyIssuedEvent::dispatch($policy);
        }

        GenerateInstallmentDebitNoteJob::dispatch($bank_transfer->installment->id);

        $this->notifyBankTransferSuccessAction->handle($bank_transfer);

        return $bank_transfer;
    }
}
