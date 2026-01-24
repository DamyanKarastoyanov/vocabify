<?php

namespace Domain\Payment\Jobs;

use Domain\Payment\Actions\GenerateAndStoreDebitNoteAction;
use Domain\Payment\Models\Installment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateInstallmentDebitNoteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $installmentId;

    public function __construct(int $installment_id)
    {
        $this->installmentId = $installment_id;
        $this->onQueue('default');
    }

    public function handle(): void
    {
        /** @var Installment|null $installment */
        $installment = Installment::query()
            ->find($this->installmentId);

        if (!$installment) {
            return;
        }

        if ($installment->debitNote()->exists()) {
            return;
        }

        $generator = app(GenerateAndStoreDebitNoteAction::class);
        $generator->handle($installment);
    }
}


