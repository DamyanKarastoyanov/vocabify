<?php

namespace App\Http\Controllers\Admin\EmailTest\Controllers;

use App\Http\Controllers\Admin\EmailTest\Queries\EmailTestQuery;
use App\Http\Controllers\Admin\EmailTest\Resources\EmailTestResource;
use App\Http\Controllers\Controller;
use Domain\Axiom\Global\Models\AxiomCurrency;
use Domain\Insurance\Mail\PolicyActivationMail;
use Domain\Insurance\Mail\PolicyCancellationMail;
use Domain\Insurance\Mail\PolicyExpirationReminderMail;
use Domain\Insurance\Mail\PolicyManualReviewRequiredMail;
use Domain\Insurance\Models\InsuranceType;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Models\PolicyStatus;
use Domain\Payment\Mail\BankTransferExpiringReminderMail;
use Domain\Payment\Mail\BankTransferInitiationMail;
use Domain\Payment\Mail\BankTransferNewReminderMail;
use Domain\Payment\Mail\BankTransferSuccessMail;
use Domain\Payment\Mail\CardPaymentFailureMail;
use Domain\Payment\Mail\CardPaymentSuccessMail;
use Domain\Payment\Mail\InstallmentDueReminderMail;
use Domain\Payment\Models\BankTransfer;
use Domain\Payment\Models\CardPayment;
use Domain\Payment\Models\Installment;
use Domain\Users\Mail\AccountActivationMail;
use Domain\Users\Mail\PasswordResetMail;
use Domain\Users\Models\Profile;
use Domain\Users\Models\User;
use Domain\Vehicles\Mail\ReminderSubscriptionConfirmationMail;
use Domain\Vehicles\Mail\MtplExpiredMail;
use Domain\Vehicles\Mail\MtplExpiringMail;
use Domain\Vehicles\Mail\NewFineMail;
use Domain\Vehicles\Mail\VehicleInspectionExpiredMail;
use Domain\Vehicles\Mail\VehicleInspectionExpiringMail;
use Domain\Vehicles\Mail\VignetteExpiredMail;
use Domain\Vehicles\Mail\VignetteExpiringMail;
use Domain\Vehicles\Models\MVRFinesCheck;
use Domain\Vehicles\Models\MVRFinesObligation;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Models\VehicleInspection;
use Domain\Vehicles\Models\VehicleMtplCheck;
use Domain\Vehicles\Models\VehicleVignette;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailTestController extends Controller
{
    private const EMAIL_TEMPLATES = [
        'Застраховка: Активиране на полица',
        'Застраховка: Напомняне за изтичане на полица',
        'Застраховка: Анулиране на полица',
        'Застраховка: Необходим ръчен преглед на полица',
        'Плащане: Иницииране на банков превод',
        'Плащане: Успешен банков превод',
        'Плащане: Успешно плащане с карта',
        'Плащане: Неуспешно плащане с карта',
        'Плащане: Напомняне за вноска',
        'Услуги: Изтичащ технически преглед',
        'Услуги: Изтекъл технически преглед',
        'Услуги: Изтичащ ГО',
        'Услуги: Изтекъл ГО',
        'Услуги: Изтичаща винетка',
        'Услуги: Изтекла винетка',
        'Услуги: Ново глоба',
        'Админ: Ново напомняне за банков превод',
        'Админ: Напомняне за изтичащ банков превод',
        'С акаунт: Потвърждение за абонамент за напомняния',
        'Без акаунт: Потвърждение за абонамент за напомняния',
        'Автентикация: Активиране на акаунт',
        'Автентикация: Нулиране на парола',
    ];

    public function index(Request $request)
    {
        if (!Auth::user() || !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized access');
        }

        return Inertia::render('admin/email-test/email-test', [
            'availableEmails' => self::EMAIL_TEMPLATES,
            'availableRecipients' => $this->getTestRecipients(),
            'hasPolicies' => true,
            'hasInstallments' => true,
            'emailTesting' => fn() => EmailTestResource::make((new EmailTestQuery($request))->get()),
        ]);
    }

    /**
     * Send test email
     */
    public function send(Request $request)
    {
        if (!Auth::user() || !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized access');
        }

        $request->validate([
            'email' => 'required|string',
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'email',
        ]);

        $email = $request->input('email');
        $recipientsEmails = $request->input('recipients');

        try {
            switch ($email) {
                case 'Застраховка: Активиране на полица':
                    $this->sendPolicyActivationEmail($recipientsEmails);
                    break;

                case 'Застраховка: Напомняне за изтичане на полица':
                    $this->sendPolicyExpirationReminderEmail($recipientsEmails);
                    break;

                case 'Застраховка: Анулиране на полица':
                    $this->sendPolicyCancellationEmail($recipientsEmails);
                    break;

                case 'Застраховка: Необходим ръчен преглед на полица':
                    $this->sendPolicyManualReviewRequiredEmail($recipientsEmails);
                    break;

                case 'Плащане: Иницииране на банков превод':
                    $this->sendBankTransferInitiationEmail($recipientsEmails);
                    break;

                case 'Плащане: Успешен банков превод':
                    $this->sendBankTransferSuccessEmail($recipientsEmails);
                    break;

                case 'Плащане: Успешно плащане с карта':
                    $this->sendCardPaymentSuccessEmail($recipientsEmails);
                    break;

                case 'Плащане: Неуспешно плащане с карта':
                    $this->sendCardPaymentFailureEmail($recipientsEmails);
                    break;

                case 'Плащане: Напомняне за вноска':
                    $this->sendInstallmentDueReminderEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтичащ технически преглед':
                    $this->sendVehicleInspectionExpiringEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтекъл технически преглед':
                    $this->sendVehicleInspectionExpiredEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтичащ ГО':
                    $this->sendMtplExpiringEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтекъл ГО':
                    $this->sendMtplExpiredEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтичаща винетка':
                    $this->sendVignetteExpiringEmail($recipientsEmails);
                    break;

                case 'Услуги: Изтекла винетка':
                    $this->sendVignetteExpiredEmail($recipientsEmails);
                    break;

                case 'Услуги: Ново глоба':
                    $this->sendNewFineEmail($recipientsEmails);
                    break;

                case 'Админ: Ново напомняне за банков превод':
                    $this->sendBankTransferNewReminderEmail($recipientsEmails);
                    break;

                case 'Админ: Напомняне за изтичащ банков превод':
                    $this->sendBankTransferExpiringReminderEmail($recipientsEmails);
                    break;

                case 'С акаунт: Потвърждение за абонамент за напомняния':
                    $this->sendReminderSubscriptionConfirmationEmail($recipientsEmails, true);
                    break;

                case 'Без акаунт: Потвърждение за абонамент за напомняния':
                    $this->sendReminderSubscriptionConfirmationEmail($recipientsEmails, false);
                    break;

                case 'Автентикация: Активиране на акаунт':
                    $this->sendAccountActivationEmail($recipientsEmails);
                    break;

                case 'Автентикация: Нулиране на парола':
                    $this->sendPasswordResetEmail($recipientsEmails);
                    break;

                default:
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Неизвестен тип имейл',
                    ]);
            }

            $recipientCount = count($recipientsEmails);
            $recipientText = $recipientCount === 1 ? 'получател' : 'получателя';
            
            return response()->json([
                'status' => 'success',
                'message' => 'Имейлът е изпратен успешно до ' . $recipientCount . ' ' . $recipientText,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Неуспешно изпращане на имейл: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function getTestRecipients(): array
    {
        $adminUsers = User::role('admin')->limit(5)->pluck('email')->toArray();

        return array_merge($adminUsers, ['test@bizo.bg']);
    }

    private function sendPolicyActivationEmail($recipients)
    {
        Mail::to($recipients)->send(new PolicyActivationMail($this->getMockPolicy()));
    }

    private function sendPolicyExpirationReminderEmail($recipients)
    {
        Mail::to($recipients)->send(new PolicyExpirationReminderMail($this->getMockPolicy()));
    }

    private function sendPolicyCancellationEmail($recipients)
    {
        Mail::to($recipients)->send(new PolicyCancellationMail($this->getMockPolicy()));
    }

    private function sendPolicyManualReviewRequiredEmail($recipients)
    {
        Mail::to($recipients)->send(new PolicyManualReviewRequiredMail($this->getMockPolicy()));
    }

    private function sendBankTransferInitiationEmail($recipients)
    {
        Mail::to($recipients)->send(new BankTransferInitiationMail($this->getMockInstallment()));
    }

    private function sendBankTransferSuccessEmail($recipients)
    {
        Mail::to($recipients)->send(new BankTransferSuccessMail($this->getMockBankTransfer()));
    }

    private function sendCardPaymentSuccessEmail($recipients)
    {
        Mail::to($recipients)->send(new CardPaymentSuccessMail($this->getMockInstallment(), $this->getMockCardPayment()));
    }

    private function sendCardPaymentFailureEmail($recipients)
    {
        Mail::to($recipients)->send(new CardPaymentFailureMail($this->getMockInstallment(), 'Test error message'));
    }

    private function sendInstallmentDueReminderEmail($recipients)
    {
        Mail::to($recipients)->send(new InstallmentDueReminderMail($this->getMockInstallment()));
    }

    private function sendBankTransferNewReminderEmail($recipients)
    {
        Mail::to($recipients)->send(new BankTransferNewReminderMail(collect([$this->getMockBankTransfer()])));
    }

    private function sendBankTransferExpiringReminderEmail($recipients)
    {
        Mail::to($recipients)->send(new BankTransferExpiringReminderMail(collect([$this->getMockBankTransfer()])));
    }

    private function sendReminderSubscriptionConfirmationEmail($recipients, $hasAccount = true)
    {
        Mail::to($recipients)->send(new ReminderSubscriptionConfirmationMail(
            $this->getMockVehicleForReminder(),
            $this->getMockUserForReminder($hasAccount)
        ));
    }

    private function sendVehicleInspectionExpiringEmail($recipients)
    {
        Mail::to($recipients)->send(new VehicleInspectionExpiringMail($this->getMockVehicleInspection()));
    }

    private function sendVehicleInspectionExpiredEmail($recipients)
    {
        Mail::to($recipients)->send(new VehicleInspectionExpiredMail($this->getMockVehicleInspection()));
    }

    private function sendMtplExpiringEmail($recipients)
    {
        Mail::to($recipients)->send(new MtplExpiringMail($this->getMockVehicleMtpl()));
    }

    private function sendMtplExpiredEmail($recipients)
    {
        Mail::to($recipients)->send(new MtplExpiredMail($this->getMockVehicleMtpl()));
    }

    private function sendVignetteExpiringEmail($recipients)
    {
        Mail::to($recipients)->send(new VignetteExpiringMail($this->getMockVehicleVignette()));
    }

    private function sendVignetteExpiredEmail($recipients)
    {
        Mail::to($recipients)->send(new VignetteExpiredMail($this->getMockVehicleVignette()));
    }

    private function sendNewFineEmail($recipients)
    {
        Mail::to($recipients)->send(new NewFineMail($this->getMockMVRFine()));
    }

    private function sendAccountActivationEmail($recipients)
    {
        Mail::to($recipients)->send(new AccountActivationMail($this->getMockAccountActivationData()));
    }

    private function sendPasswordResetEmail($recipients)
    {
        Mail::to($recipients)->send(new PasswordResetMail($this->getMockPasswordResetData()));
    }

    private function getMockPolicy()
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->phone = '+359888123456';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $insuranceType = new InsuranceType();
        $insuranceType->id = 4;
        $insuranceType->name = 'Гражданска отговорност';
        $insuranceType->code = 'MTPL';
        $insuranceType->exists = true;

        $policyStatus = new PolicyStatus();
        $policyStatus->id = PolicyStatus::STATUSES['ACTIVE'];
        $policyStatus->name = 'Active';
        $policyStatus->code = 'active';
        $policyStatus->exists = true;

        $insurable = new \stdClass();
        $insurable->id = 999999;
        $insurable->model = 'VW Golf';
        $insurable->registration_number = 'СА1234АВ';

        $policy = new Policy();
        $policy->id = 999999;
        $policy->policy_number = 'TEST-POL-2025-001';
        $policy->start_date = now();
        $policy->end_date = now()->addYear();
        $policy->total_amount = 245.50;
        $policy->policy_status_id = PolicyStatus::STATUSES['ACTIVE'];
        $policy->exists = true;
        $policy->setRelation('user', $user);
        $policy->setRelation('insuranceType', $insuranceType);
        $policy->setRelation('internalStatus', $policyStatus);
        $policy->setRelation('insurable', $insurable);

        return $policy;
    }

    private function getMockInstallment()
    {
        $currency = new AxiomCurrency();
        $currency->id = 1;
        $currency->name = 'BGN';
        $currency->axiom_id = 'BGN';
        $currency->exists = true;

        $installment = new Installment();
        $installment->id = 999999;
        $installment->amount_due = 122.75;
        $installment->due_date = now()->addDays(7);
        $installment->sequence = 1;
        $installment->exists = true;
        $installment->setRelation('policy', $this->getMockPolicy());
        $installment->setRelation('currency', $currency);

        return $installment;
    }

    private function getMockBankTransfer()
    {
        $bankTransfer = new BankTransfer();
        $bankTransfer->id = 999999;
        $bankTransfer->reference_number = 'BT-2025-001234';
        $bankTransfer->amount = 122.75;
        $bankTransfer->created_at = now()->subDays(1);
        $bankTransfer->exists = true;
        $bankTransfer->setRelation('installment', $this->getMockInstallment());

        return $bankTransfer;
    }

    private function getMockCardPayment()
    {
        $cardPayment = new CardPayment();
        $cardPayment->id = 999999;
        $cardPayment->reference_number = 'TX-2025-567890';
        $cardPayment->amount = 122.75;
        $cardPayment->created_at = now();
        $cardPayment->exists = true;

        return $cardPayment;
    }

    private function getMockVehicleInspection()
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $vehicle = new Vehicle();
        $vehicle->id = 999999;
        $vehicle->vin = 'WVWZZZ1KZXW123456';
        $vehicle->reg_number = 'СА1234АВ';
        $vehicle->exists = true;
        $vehicle->setRelation('users', collect([$user]));

        $inspection = new VehicleInspection();
        $inspection->id = 999999;
        $inspection->next_inspection_date = now()->addMonths(1);
        $inspection->is_valid = true;
        $inspection->exists = true;
        $inspection->setRelation('vehicle', $vehicle);

        return $inspection;
    }

    private function getMockVehicleVignette()
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $vehicle = new Vehicle();
        $vehicle->id = 999999;
        $vehicle->reg_number = 'СА1234АВ';
        $vehicle->exists = true;
        $vehicle->setRelation('users', collect([$user]));

        $vignette = new VehicleVignette();
        $vignette->id = 999999;
        $vignette->valid_to = now()->addDays(14);
        $vignette->vignette_number = 'VIG-2025-001';
        $vignette->exists = true;
        $vignette->setRelation('vehicle', $vehicle);

        return $vignette;
    }

    private function getMockVehicleForReminder(): Vehicle
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->is_active = true;
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $vehicle = new Vehicle();
        $vehicle->id = 999999;
        $vehicle->reg_number = 'СА1234АВ';
        $vehicle->exists = true;
        $vehicle->setRelation('users', collect([$user]));

        return $vehicle;
    }

    private function getMockUserForReminder($hasAccount = true): User
    {
        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->is_active = $hasAccount;
        $user->exists = true;

        return $user;
    }

    private function getMockVehicleMtpl()
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $vehicle = new Vehicle();
        $vehicle->id = 999999;
        $vehicle->reg_number = 'СА1234АВ';
        $vehicle->exists = true;
        $vehicle->setRelation('users', collect([$user]));

        $mtpl = new VehicleMtplCheck();
        $mtpl->id = 999999;
        $mtpl->end_date = now()->addDays(7);
        $mtpl->has_valid_insurance = true;
        $mtpl->insurer = 'DZI';
        $mtpl->exists = true;
        $mtpl->setRelation('vehicle', $vehicle);

        return $mtpl;
    }

    private function getMockMVRFine()
    {
        $profile = new Profile();
        $profile->id = 999999;
        $profile->first_name = 'Иван';
        $profile->last_name = 'Петров';
        $profile->exists = true;

        $user = new User();
        $user->id = 999999;
        $user->email = 'test@bizo.bg';
        $user->exists = true;
        $user->setRelation('profile', $profile);

        $vehicle = new Vehicle();
        $vehicle->id = 999999;
        $vehicle->reg_number = 'СА1234АВ';
        $vehicle->exists = true;
        $vehicle->setRelation('users', collect([$user]));

        $mvrFinesCheck = new MVRFinesCheck();
        $mvrFinesCheck->id = 999999;
        $mvrFinesCheck->vehicle_id = 999999;
        $mvrFinesCheck->exists = true;
        $mvrFinesCheck->setRelation('vehicle', $vehicle);

        $fine = new MVRFinesObligation();
        $fine->id = 999999;
        $fine->amount_to_pay_bgn = 50.00;
        $fine->violation = 'Превишена скорост в населено място';
        $fine->violation_date = now()->subDays(3);
        $fine->document_number = 'FINE-2025-001';
        $fine->exists = true;
        $fine->setRelation('mvrFinesCheck', $mvrFinesCheck);

        return $fine;
    }

    private function getMockAccountActivationData()
    {
        return [
            'activation_link' => route('account.activate', ['token' => 'test-activation-token-12345']),
            'is_after_policy_activation' => false,
        ];
    }

    private function getMockPasswordResetData()
    {
        return [
            'name' => 'Иван Петров',
            'email' => 'test@bizo.bg',
            'reset_url' => route('password.reset', ['token' => 'test-reset-token-12345', 'email' => 'test@bizo.bg']),
        ];
    }

    public function preview(Request $request, string $type)
    {
        if (!Auth::user() || !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized access');
        }

        $mailable = match ($type) {
            'policy-activation' => new PolicyActivationMail($this->getMockPolicy()),
            'policy-expiration' => new PolicyExpirationReminderMail($this->getMockPolicy()),
            'policy-cancellation' => new PolicyCancellationMail($this->getMockPolicy()),
            'policy-manual-review' => new PolicyManualReviewRequiredMail($this->getMockPolicy()),
            'bank-transfer-initiation' => new BankTransferInitiationMail($this->getMockInstallment()),
            'bank-transfer-success' => new BankTransferSuccessMail($this->getMockBankTransfer()),
            'card-payment-success' => new CardPaymentSuccessMail($this->getMockInstallment(), $this->getMockCardPayment()),
            'card-payment-failure' => new CardPaymentFailureMail($this->getMockInstallment(), 'Test error message'),
            'installment-due-reminder' => new InstallmentDueReminderMail($this->getMockInstallment()),
            'vehicle-inspection-expiring' => new VehicleInspectionExpiringMail($this->getMockVehicleInspection()),
            'vehicle-inspection-expired' => new VehicleInspectionExpiredMail($this->getMockVehicleInspection()),
            'mtpl-expiring' => new MtplExpiringMail($this->getMockVehicleMtpl()),
            'mtpl-expired' => new MtplExpiredMail($this->getMockVehicleMtpl()),
            'vignette-expiring' => new VignetteExpiringMail($this->getMockVehicleVignette()),
            'vignette-expired' => new VignetteExpiredMail($this->getMockVehicleVignette()),
            'new-fine-alert' => new NewFineMail($this->getMockMVRFine()),
            'bank-transfer-new-reminder' => new BankTransferNewReminderMail(collect([$this->getMockBankTransfer()])),
            'bank-transfer-expiring-reminder' => new BankTransferExpiringReminderMail(collect([$this->getMockBankTransfer()])),
            'reminder-subscription-confirmation-no-account-exists' => new ReminderSubscriptionConfirmationMail(
                $this->getMockVehicleForReminder(),
                $this->getMockUserForReminder(false)
            ),
            'reminder-subscription-confirmation-with-account' => new ReminderSubscriptionConfirmationMail(
                $this->getMockVehicleForReminder(),
                $this->getMockUserForReminder(true)
            ),
            'account-activation' => new AccountActivationMail($this->getMockAccountActivationData()),
            'password-reset' => new PasswordResetMail($this->getMockPasswordResetData()),
            default => abort(404, 'Email type not found'),
        };

        return $mailable;
    }
}

