<?php

namespace App\Providers;

use Domain\Axiom\HomeInsurance\Models\AxiomHomeInsuranceOffer;
use Domain\Axiom\HomeInsurance\Policies\AxiomHomeInsuranceOfferPolicy;
use Domain\Axiom\NonResidentInsurance\Models\AxiomNonResidentInsuranceOffer;
use Domain\Axiom\NonResidentInsurance\Policies\AxiomNonResidentInsuranceOfferPolicy;
use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Domain\Axiom\TravelInsurance\Policies\AxiomTravelInsuranceOfferPolicy;
use Domain\Insurance\Models\Policy;
use Domain\Insurance\Policies\PolicyPolicy;
use Domain\Payment\Models\Installment;
use Domain\Payment\Policies\InstallmentPolicy;
use Domain\Users\Models\Address;
use Domain\Users\Models\Person;
use Domain\Users\Models\Property;
use Domain\Users\Policies\AddressPolicy;
use Domain\Users\Policies\PersonPolicy;
use Domain\Users\Policies\PropertyPolicy;
use Domain\Vehicles\Models\Vehicle;
use Domain\Vehicles\Policies\VehiclePolicy;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Schema::defaultStringLength(191);
        Gate::policy(AxiomHomeInsuranceOffer::class, AxiomHomeInsuranceOfferPolicy::class);
        Gate::policy(AxiomTravelInsuranceOffer::class, AxiomTravelInsuranceOfferPolicy::class);
        Gate::policy(AxiomNonResidentInsuranceOffer::class, AxiomNonResidentInsuranceOfferPolicy::class);
        Gate::policy(Property::class, PropertyPolicy::class);
        Gate::policy(Person::class, PersonPolicy::class);
        Gate::policy(Address::class, AddressPolicy::class);
        Gate::policy(Policy::class, PolicyPolicy::class);
        Gate::policy(Installment::class, InstallmentPolicy::class);
        Gate::policy(Vehicle::class, VehiclePolicy::class);
    }
}
