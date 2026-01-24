<?php

use App\Http\Middleware\VerifyBroqeeDevelopmentProxyKeyMiddleware;
use App\Http\Middleware\VerifyBroqeeWebhookIPMiddleware;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceMunicipalitiesController;
use App\Http\Middleware\WithoutJsonDataWrapping;
use App\Http\Web\Addresses\Controllers\AddressesAddressDetailsController;
use App\Http\Web\Admin\MailTracker\Controllers\MailTrackerController;
use App\Http\Controllers\Admin\EmailTest\Controllers\EmailTestController;
use App\Http\Web\Addresses\Controllers\AddressesController;
use App\Http\Web\Addresses\Controllers\AddressesCreateAddressController;
use App\Http\Web\Addresses\Controllers\AddressesDeleteAddressController;
use App\Http\Web\Addresses\Controllers\AddressesUpdateAddressController;
use App\Http\Web\Vehicles\Controllers\VehiclesController;
use App\Http\Web\Vehicles\Controllers\VehiclesCreateVehicleController;
use App\Http\Web\Vehicles\Controllers\VehiclesDeleteVehicleController;
use App\Http\Web\Vehicles\Controllers\VehiclesUpdateVehicleController;
use App\Http\Web\Vehicles\Controllers\VehiclesVehicleDetailsController;
use App\Http\Web\Admin\Payments\Controllers\PaymentsController;
use App\Http\Web\Admin\Payments\Controllers\PaymentsExportController;
use App\Http\Web\Admin\Payments\Controllers\PaymentsUpdatePaymentStatusController;
use App\Http\Web\Admin\Policies\Controllers\PoliciesUpdatePolicyStatusController;
use App\Http\Web\Admin\Policies\Controllers\PoliciesController as AdminPoliciesController;
use App\Http\Web\Admin\Policies\Controllers\PoliciesExportController as AdminPoliciesExportController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceCalculatePriceController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceCreatePolicyController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceDownloadPolicyController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceGetOfferController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsurancePaymentCallbackController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsurancePaymentController;
use App\Http\Web\HomeInsurance\Controllers\HomeInsuranceTownsController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsuranceCalculatePriceController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsuranceController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsuranceCreatePolicyController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsuranceDownloadPolicyController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsuranceGetOfferController;
use App\Http\Web\Persons\Controllers\PersonsController;
use App\Http\Web\Persons\Controllers\PersonsCreatePersonController;
use App\Http\Web\Persons\Controllers\PersonsDeletePersonController;
use App\Http\Web\Persons\Controllers\PersonsPersonDetailsController;
use App\Http\Web\Persons\Controllers\PersonsUpdatePersonController;
use App\Http\Web\Properties\Controllers\PropertiesController;
use App\Http\Web\Properties\Controllers\PropertiesCreatePropertyController;
use App\Http\Web\Properties\Controllers\PropertiesDeletePropertyController;
use App\Http\Web\Properties\Controllers\PropertiesPropertyDetailsController;
use App\Http\Web\Properties\Controllers\PropertiesUpdatePropertyController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceCalculatePriceController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceCreatePolicyController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceDownloadPolicyController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceGetOfferController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsuranceTravelTypeActivitiesController;
use App\Http\Web\Dashboard\Controllers\DashboardController;
use App\Http\Web\DebitNotes\Controllers\DebitNotesDownloadController;
use App\Http\Web\Installments\Controllers\InstallmentDetailsController;
use App\Http\Web\Installments\Controllers\InstallmentDownloadController;
use App\Http\Web\Installments\Controllers\InstallmentGuestPaymentCallbackController;
use App\Http\Web\Installments\Controllers\InstallmentGuestPaymentController;
use App\Http\Web\Installments\Controllers\InstallmentGuestPaymentProcessController;
use App\Http\Web\Installments\Controllers\InstallmentPaymentCallbackController;
use App\Http\Web\Installments\Controllers\InstallmentPaymentController;
use App\Http\Web\Installments\Controllers\InstallmentsController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceCalculateController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceCheckCalculationController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceChooseInsurerController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceConfirmOfferController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceCreatePolicyController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceGetVehiclePersonDataController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsurancePaymentCallbackController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsurancePaymentController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsurancePolicyIssuanceWebhookController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsurancePaymentCallbackController;
use App\Http\Web\NonResidentInsurance\Controllers\NonResidentInsurancePaymentController;
use App\Http\Web\Policies\Controllers\PoliciesController;
use App\Http\Web\Policies\Controllers\PoliciesPolicyDetailsController;
use App\Http\Web\Policies\Controllers\PolicyInstallmentDetailsController;
use App\Http\Web\Profile\Controllers\ProfileController;
use App\Http\Web\Profile\Controllers\ProfileUpdateController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsurancePaymentCallbackController;
use App\Http\Web\TravelInsurance\Controllers\TravelInsurancePaymentController;
use App\Services\BroqeeDevelopmentProxy\BroqeeDevelopmentProxyController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use App\Http\Web\VehicleInspection\Controllers\VehicleInspectionCaptchaController;
use App\Http\Web\VehicleInspection\Controllers\VehicleInspectionCheckController;
use App\Http\Web\VehicleInspection\Controllers\VehicleInspectionController;
use App\Http\Web\MTPLCheck\Controllers\MtplCheckController;
use App\Http\Web\MTPLCheck\Controllers\MtplCheckSubmitController;
use App\Http\Web\MTPLInsurance\Controllers\MTPLInsuranceDownloadPolicyController;
use App\Http\Web\VignetteCheck\Controllers\VignetteCheckController;
use App\Http\Web\VignetteCheck\Controllers\VignetteCheckSubmitController;
use App\Http\Web\MVRFinesCheck\Controllers\MVRFinesCheckController;
use App\Http\Web\MVRFinesCheck\Controllers\MVRFinesCheckSubmitController;
use App\Http\Web\OptIn\Controllers\OptInSubscribeController;
use App\Http\Web\OptIn\Controllers\OptInUnsubscribeController;
use App\Http\Web\OptIn\Controllers\OptInUnsubscribeSuccessController;
use App\Http\Web\OptIn\Controllers\OptInResubscribeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Facades\MTPLInsuranceGateway;


Route::get('/', function () {
    return Inertia::render('welcome/welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::get('/form-test', function () {
    return Inertia::render('form-test/form-test');
})->name('form-test');

Route::prefix('/home-insurance')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', HomeInsuranceController::class)
            ->name('home-insurance');

        Route::post('/calculate-price', HomeInsuranceCalculatePriceController::class)
            ->name('home-insurance.calculate-price');

        Route::post('/get-offer', HomeInsuranceGetOfferController::class)
            ->name('home-insurance.get-offer');


        Route::post('/create-policy', HomeInsuranceCreatePolicyController::class)
            ->name('home-insurance.create-policy');

        Route::get('/payment', HomeInsurancePaymentCallbackController::class)
            ->name('home-insurance.payment.callback');

        Route::post('/payment/{offer}', HomeInsurancePaymentController::class)
            ->name('home-insurance.payment');

        Route::get('/download-policy/{policy}', HomeInsuranceDownloadPolicyController::class)
            ->name('home-insurance.download-policy');

        Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
            ->name('home-insurance.municipalities');

        Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
            ->name('home-insurance.towns');
});

Route::prefix('/travel-insurance')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', TravelInsuranceController::class)
            ->name('travel-insurance');

        Route::post('/calculate-price', TravelInsuranceCalculatePriceController::class)
            ->name('travel-insurance.calculate-price');

        Route::post('/get-offer', TravelInsuranceGetOfferController::class)
            ->name('travel-insurance.get-offer');

        Route::post('/create-policy', TravelInsuranceCreatePolicyController::class)
            ->name('travel-insurance.create-policy');

        Route::get('/payment', TravelInsurancePaymentCallbackController::class)
            ->name('travel-insurance.payment.callback');

        Route::post('/payment/{offer}', TravelInsurancePaymentController::class)
            ->name('travel-insurance.payment');

        Route::get('/download-policy/{policy}', TravelInsuranceDownloadPolicyController::class)
            ->name('travel-insurance.download-policy');

        Route::get('/travel-type-activities/{axiom_travel_type}', TravelInsuranceTravelTypeActivitiesController::class)
            ->name('travel-insurance.travel-type-activities');

        // TODO: Move this controllers in order to be used by all insurance types
        Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
            ->name('travel-insurance.municipalities');

        Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
            ->name('travel-insurance.towns');
});

Route::prefix('/non-resident-insurance')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', NonResidentInsuranceController::class)
            ->name('non-resident-insurance');

        Route::post('/calculate-price', NonResidentInsuranceCalculatePriceController::class)
            ->name('non-resident-insurance.calculate-price');

        Route::post('/get-offer', NonResidentInsuranceGetOfferController::class)
            ->name('non-resident-insurance.get-offer');

        Route::post('/create-policy', NonResidentInsuranceCreatePolicyController::class)
            ->name('non-resident-insurance.create-policy');

            Route::get('/payment', NonResidentInsurancePaymentCallbackController::class)
            ->name('non-resident-insurance.payment.callback');

        Route::post('/payment/{offer}', NonResidentInsurancePaymentController::class)
            ->name('non-resident-insurance.payment');

        Route::get('/download-policy/{policy}', NonResidentInsuranceDownloadPolicyController::class)
            ->name('non-resident-insurance.download-policy');

        // TODO: Move this controllers in order to be used by all insurance types
        Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
            ->name('non-resident-insurance.municipalities');

        Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
            ->name('non-resident-insurance.towns');
});

Route::prefix('/mtpl-insurance')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', MTPLInsuranceController::class)
            ->name('mtpl-insurance');

        Route::post('/vehicle-person-data', MTPLInsuranceGetVehiclePersonDataController::class)
            ->name('mtpl-insurance.vehicle-person-data');

        Route::post('/calculate', MTPLInsuranceCalculateController::class)
            ->name('mtpl-insurance.calculate');

        Route::post('/check-calculation', MTPLInsuranceCheckCalculationController::class)
            ->name('mtpl-insurance.check-calculation');

        Route::post('/choose-insurer', MTPLInsuranceChooseInsurerController::class)
            ->name('mtpl-insurance.choose-insurer');

        Route::post('/confirm-offer', MTPLInsuranceConfirmOfferController::class)
            ->name('mtpl-insurance.confirm-offer');

        Route::post('/create-policy', MTPLInsuranceCreatePolicyController::class)
            ->name('mtpl-insurance.create-policy');

        Route::get('/payment', MTPLInsurancePaymentCallbackController::class)
            ->name('mtpl-insurance.payment.callback');

        Route::post('/payment', MTPLInsurancePaymentController::class)
            ->name('mtpl-insurance.payment');

        Route::post('/policy-issuance', MTPLInsurancePolicyIssuanceWebhookController::class)
            ->middleware(VerifyBroqeeWebhookIPMiddleware::class)
            ->withoutMiddleware([VerifyCsrfToken::class])
            ->name('mtpl-insurance.policy-issuance');

        Route::get('/download-policy/{policy}', MTPLInsuranceDownloadPolicyController::class)
            ->name('mtpl-insurance.download-policy');
});

Route::prefix('/vehicle-inspection')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', VehicleInspectionController::class)
            ->name('vehicle-inspection');

        Route::get('/captcha', VehicleInspectionCaptchaController::class)
            ->name('vehicle-inspection.captcha');

        Route::post('/check', VehicleInspectionCheckController::class)
            ->name('vehicle-inspection.check');
});

Route::prefix('/mtpl-check')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', MtplCheckController::class)
            ->name('mtpl-check');

        Route::post('/check', MtplCheckSubmitController::class)
            ->name('mtpl-check.submit');
});

Route::prefix('/vignette-check')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', VignetteCheckController::class)
            ->name('vignette-check');

        Route::post('/check', VignetteCheckSubmitController::class)
            ->name('vignette-check.submit');
});

Route::prefix('/mvr-fines-check')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', MVRFinesCheckController::class)
            ->name('mvr-fines-check');

        Route::post('/check', MVRFinesCheckSubmitController::class)
            ->name('mvr-fines-check.submit');
    });

Route::prefix('/opt-in')
    ->group(function () {
        Route::post('/subscribe', OptInSubscribeController::class)
            ->name('opt-in.subscribe');

        Route::get('/unsubscribe', OptInUnsubscribeController::class)
            ->name('opt-in.unsubscribe');

        Route::get('/unsubscribe/success', OptInUnsubscribeSuccessController::class)
            ->name('opt-in.unsubscribe.success');

        Route::post('/resubscribe', OptInResubscribeController::class)
            ->name('opt-in.resubscribe');
    });

Route::get('/test', function () {
    //
});

Route::any('/broqee-proxy/{endpoint?}', [BroqeeDevelopmentProxyController::class, 'handle'])
    ->middleware(VerifyBroqeeDevelopmentProxyKeyMiddleware::class)
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->where('endpoint', '.*');

// DOWNLOAD ROUTES PROTECTED BY POLICIES AND TEMPORARY SIGNED URLS
Route::prefix('/debit-notes')
    ->group(function () {
        Route::get('/{debitNote}', DebitNotesDownloadController::class)
            ->name('debit-note.download');
        Route::get('/{debitNote}/view', DebitNotesDownloadController::class)
            ->name('debit-note.view');
    });

Route::prefix('/installments')
        ->group(function () {
            Route::get('/{installment}/download', InstallmentDownloadController::class)
                ->name('installments.download');

            Route::get('/guest-payment/{token}', InstallmentGuestPaymentController::class)
                ->name('installments.guest-payment');

            Route::post('/guest-payment/{installment}/process', InstallmentGuestPaymentProcessController::class)
                ->name('installments.guest-payment.process');

            Route::get('/guest-payment-callback', InstallmentGuestPaymentCallbackController::class)
                ->name('installments.guest-payment.callback');
    });

Route::get('/terms-and-conditions', function () {
    return Inertia::render('terms-and-conditions/terms-and-conditions');
})->name('terms-and-conditions');

Route::get('/privacy-policy', function () {
    return Inertia::render('privacy-policy/privacy-policy');
})->name('privacy-policy');

Route::middleware(['auth', WithoutJsonDataWrapping::class])->group(function () {
    Route::prefix('/profile')
        ->group(function () {
            Route::get('/{user?}', ProfileController::class)
                ->name('profile');

            Route::post('/update/{user?}', ProfileUpdateController::class)
                ->name('profile.update');
            // TODO: Move this controllers in order to be used by all insurance types
            Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
                ->name('profile.municipalities');

            Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
                ->name('profile.towns');
    });

    Route::prefix('/admin')->middleware(['role:admin'])->group(function () {
        Route::prefix('/mail-tracker')
            ->group(function () {
                Route::get('/', [MailTrackerController::class, 'getIndex'])->name('bizo_mailTracker_Index');
                Route::post('/search', [MailTrackerController::class, 'postSearch'])->name('bizo_mailTracker_Search');
                Route::get('/clear', [MailTrackerController::class, 'clearSearch'])->name('bizo_mailTracker_ClearSearch');
            });

        Route::prefix('/payments')
            ->group(function () {
                Route::get('/', PaymentsController::class)
                    ->name('payments.admin.index');

                Route::get('/export', PaymentsExportController::class)
                    ->name('payments.admin.export');

                Route::post('/{bank_transfer}/update', PaymentsUpdatePaymentStatusController::class)
                    ->name('payments.admin.update');
        });

        Route::prefix('/policies')
            ->group(function () {
                Route::get('/', AdminPoliciesController::class)
                    ->name('policies.admin.index');

                Route::get('/export', AdminPoliciesExportController::class)
                    ->name('policies.admin.export');

                Route::post('/{policy}/update', PoliciesUpdatePolicyStatusController::class)
                    ->name('policies.admin.update');
        });

        Route::prefix('/email-test')
            ->group(function () {
                Route::get('/', [EmailTestController::class, 'index'])
                    ->name('admin.email-test.index');

                Route::post('/send', [EmailTestController::class, 'send'])
                    ->name('admin.email-test.send');

                Route::get('/preview/{type}', [EmailTestController::class, 'preview'])
                    ->name('admin.email-test.preview');
        });
    });

    Route::prefix('/properties')
        ->group(function () {
            Route::get('/', PropertiesController::class)
                ->name('properties.index');

            Route::get('/details/{property?}', PropertiesPropertyDetailsController::class)
                ->name('properties.show');

            Route::post('/create', PropertiesCreatePropertyController::class)
                ->name('properties.create');

            Route::put('/{property}/update', PropertiesUpdatePropertyController::class)
                ->name('properties.update');

            Route::delete('/{property}/delete', PropertiesDeletePropertyController::class)
                ->name('properties.delete');

            // TODO: Move this controllers in order to be used by all insurance types
            Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
                ->name('properties.municipalities');

            Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
                ->name('properties.towns');
    });

    Route::prefix('/persons')
        ->group(function () {
            Route::get('/', PersonsController::class)
                ->name('persons.index');

            Route::get('details/{person?}', PersonsPersonDetailsController::class)
                ->name('persons.show');

            Route::post('/create', PersonsCreatePersonController::class)
                ->name('persons.create');

            Route::put('/{person}/update', PersonsUpdatePersonController::class)
                ->name('persons.update');

            Route::delete('/{person}/delete', PersonsDeletePersonController::class)
                ->name('persons.delete');

            // TODO: Move this controllers in order to be used by all insurance types
            Route::get('/municipalities/{axiom_district_id}', HomeInsuranceMunicipalitiesController::class)
                ->name('persons.municipalities');

            Route::get('/towns/{axiom_municipality_id}', HomeInsuranceTownsController::class)
                ->name('persons.towns');
    });

    Route::prefix('/addresses')
        ->group(function () {
            Route::get('/', AddressesController::class)
                ->name('addresses.index');

            Route::get('/details/{address?}', AddressesAddressDetailsController::class)
                ->name('addresses.show');

            Route::post('/create', AddressesCreateAddressController::class)
                ->name('addresses.create');

            Route::put('/{address}/update', AddressesUpdateAddressController::class)
                ->name('addresses.update');

            Route::delete('/{address}/delete', AddressesDeleteAddressController::class)
                ->name('addresses.delete');
    });

    Route::prefix('/vehicles')
        ->group(function () {
            Route::get('/', VehiclesController::class)
                ->name('vehicles.index');

            Route::get('/details/{vehicle?}', VehiclesVehicleDetailsController::class)
                ->name('vehicles.show');

            Route::post('/create', VehiclesCreateVehicleController::class)
                ->name('vehicles.create');

            Route::put('/{vehicle}/update', VehiclesUpdateVehicleController::class)
                ->name('vehicles.update');

            Route::delete('/{vehicle}/delete', VehiclesDeleteVehicleController::class)
                ->name('vehicles.delete');
    });

    Route::prefix('/policies')
        ->group(function () {
            Route::get('/', PoliciesController::class)
                ->name('policies.index');

            Route::get('/details/{policy}', PoliciesPolicyDetailsController::class)
                ->name('policies.show');

            Route::get('/details/{policy}/installments', PolicyInstallmentDetailsController::class)
                ->name('policies.show.installments');
    });

    Route::prefix('/installments')
        ->group(function () {
            Route::get('/', InstallmentsController::class)
                ->name('installments.index');

            Route::get('/details/{installment}', InstallmentDetailsController::class)
                ->name('installments.show');

            Route::post('/payment/{installment}', InstallmentPaymentController::class)
                ->name('installments.payment');

            Route::get('/payment-callback', InstallmentPaymentCallbackController::class)
                ->name('installments.payment.callback');
    });

    Route::prefix('/dashboard')
    ->middleware([WithoutJsonDataWrapping::class])
    ->group(function () {
        Route::get('/', DashboardController::class)
            ->name('dashboard');
    });

});

require __DIR__.'/auth.php';
