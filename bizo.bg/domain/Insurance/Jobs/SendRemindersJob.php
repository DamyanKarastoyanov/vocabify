<?php

namespace Domain\Insurance\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Domain\Axiom\Global\Models\AxiomPolicyStatus;
use Domain\Insurance\Mail\PolicyExpirationReminderMail;
use Domain\Insurance\Models\InsuranceType;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Services\ReminderService;
use Domain\Payment\Models\Installment;
use Domain\Payment\Mail\InstallmentDueReminderMail;
use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\PaymentStatus;
use Domain\Payment\Mail\BankTransferNewReminderMail;
use Domain\Payment\Mail\BankTransferExpiringReminderMail;
use Domain\Users\Models\User;
use Domain\Vehicles\Models\VehicleInspection;
use Domain\Vehicles\Models\VehicleVignette;
use Domain\Vehicles\Models\VehicleMtplCheck;
use Domain\Vehicles\Models\MVRFinesObligation;
use Domain\Vehicles\Mail\VehicleInspectionExpiringMail;
use Domain\Vehicles\Mail\VehicleInspectionExpiredMail;
use Domain\Vehicles\Mail\VignetteExpiringMail;
use Domain\Vehicles\Mail\VignetteExpiredMail;
use Domain\Vehicles\Mail\MtplExpiringMail;
use Domain\Vehicles\Mail\MtplExpiredMail;
use Domain\Vehicles\Mail\NewFineMail;

class SendRemindersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(ReminderService $reminderService): void
    {
        // 1. Policy expiry reminders
        $policies = Policy::query()
            ->whereNot('user_id', User::SYSTEM_USER_ID)
            ->where('end_date', '<=', now()->addDays(7))
            ->whereHas('status', function ($query) {
                $query->where('id', AxiomPolicyStatus::ACTIVE_ID);
            })
            ->whereDoesntHave('reminders', function ($query) {
                $query->where('type', 'policy_expiry');
            })
            ->whereDoesntHave('insuranceType', function($query) {
                $query->where('code', InsuranceType::TYPES['TRAVEL']);
            })
            ->get();

        $reminderService->sendReminders($policies, 'policy_expiry', PolicyExpirationReminderMail::class, fn($policy) => [$policy->user]);

        // 2. Installment due reminders (unpaid, due in < 3 days)
        $installments = Installment::query()
            ->where('due_date', '>', now())
            ->where('due_date', '<', now()->addDays(3))
            ->where(function ($query) {
                $query->doesntHave('payment')
                    ->orWhereHasMorph(
                        'payment',
                        [\Domain\Payment\Models\CardPayment::class, \Domain\Payment\Models\BankTransfer::class],
                        function ($q) {
                            $q->where('payment_status_id', '!=', \Domain\Payment\Models\PaymentStatus::STATUSES['VERIFIED']);
                        }
                    );
            })
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'installment_due'))
            ->whereDoesntHave('policy', fn($q) => $q->where('user_id', User::SYSTEM_USER_ID))
            ->with(['policy.user', 'currency'])
            ->get();

        $reminderService->sendReminders($installments, 'installment_due', InstallmentDueReminderMail::class, fn($installment) => [$installment->policy->user]);

		// 3. Bank transfer reminders for admins (users with 'edit payments' permission)
		$recipients = User::permission('edit payments')->pluck('email')->filter()->values();

        if ($recipients->isNotEmpty()) {
            // New bank transfers in last 24 hours, not yet reminded as 'bank_transfer_new'
            $newTransfers = BankTransfer::query()
                ->where('payment_status_id', PaymentStatus::STATUSES['PENDING'])
                ->where('created_at', '>=', now()->subDay())
                ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'bank_transfer_new'))
                ->with(['installment.policy'])
                ->get();

            $reminderService->sendGroupReminders(
                $newTransfers,
                'bank_transfer_new',
                BankTransferNewReminderMail::class,
                $recipients->all()
            );

            // Expiring bank transfers: created between (now-3d, now-2d], pending, not yet reminded as 'bank_transfer_expiring'
            $expiringTransfers = BankTransfer::query()
                ->where('payment_status_id', PaymentStatus::STATUSES['PENDING'])
                ->where('created_at', '>', now()->subDays(3))
                ->where('created_at', '<=', now()->subDays(2))
                ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'bank_transfer_expiring'))
                ->with(['installment.policy'])
                ->get();

            $reminderService->sendGroupReminders(
                $expiringTransfers,
                'bank_transfer_expiring',
                BankTransferExpiringReminderMail::class,
                $recipients->all()
            );
        }

        // 4. Vehicle inspection expiring reminders (expiring in <= 7 days)
        $inspectionsExpiring = VehicleInspection::query()
            ->where('next_inspection_date', '>', now())
            ->where('next_inspection_date', '<=', now()->addDays(7))
            ->where('is_valid', true)
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'vehicle_inspection_expiring'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($inspection) => $inspection->vehicle->users()->exists());

        $reminderService->sendReminders(
            $inspectionsExpiring,
            'vehicle_inspection_expiring',
            VehicleInspectionExpiringMail::class,
            fn($inspection) => $inspection->vehicle->users
        );

        // 5. Vehicle inspection expired reminders (expired, not yet reminded)
        $inspectionsExpired = VehicleInspection::query()
            ->where('next_inspection_date', '<', now())
            ->where('is_valid', false)
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'vehicle_inspection_expired'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($inspection) => $inspection->vehicle->users()->exists());

        $reminderService->sendReminders(
            $inspectionsExpired,
            'vehicle_inspection_expired',
            VehicleInspectionExpiredMail::class,
            fn($inspection) => $inspection->vehicle->users
        );

        // 6. Vehicle vignette expiring reminders (expiring in <= 7 days)
        $vignettesExpiring = VehicleVignette::query()
            ->where('valid_to', '>', now())
            ->where('valid_to', '<=', now()->addDays(7))
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'vignette_expiring'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($vignette) => $vignette->vehicle->users()->exists());

        $reminderService->sendReminders(
            $vignettesExpiring,
            'vignette_expiring',
            VignetteExpiringMail::class,
            fn($vignette) => $vignette->vehicle->users
        );

        // 7. Vehicle vignette expired reminders (expired, not yet reminded)
        $vignettesExpired = VehicleVignette::query()
            ->where('valid_to', '<', now())
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'vignette_expired'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($vignette) => $vignette->vehicle->users()->exists());

        $reminderService->sendReminders(
            $vignettesExpired,
            'vignette_expired',
            VignetteExpiredMail::class,
            fn($vignette) => $vignette->vehicle->users
        );

        // 8. Vehicle MTPL expiring reminders (expiring in <= 7 days)
        $mtplExpiring = VehicleMtplCheck::query()
            ->where('end_date', '>', now())
            ->where('end_date', '<=', now()->addDays(7))
            ->where('has_valid_insurance', true)
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'mtpl_expiring'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($mtpl) => $mtpl->vehicle->users()->exists());

        $reminderService->sendReminders(
            $mtplExpiring,
            'mtpl_expiring',
            MtplExpiringMail::class,
            fn($mtpl) => $mtpl->vehicle->users
        );

        // 9. Vehicle MTPL expired reminders (expired, not yet reminded)
        $mtplExpired = VehicleMtplCheck::query()
            ->where('end_date', '<', now())
            ->where('has_valid_insurance', false)
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'mtpl_expired'))
            ->with(['vehicle.users'])
            ->get()
            ->filter(fn($mtpl) => $mtpl->vehicle->users()->exists());

        $reminderService->sendReminders(
            $mtplExpired,
            'mtpl_expired',
            MtplExpiredMail::class,
            fn($mtpl) => $mtpl->vehicle->users
        );
    }
}
