<?php

namespace App\Http\Web\TravelInsurance\Queries;

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceTravelType;
use Illuminate\Http\Request;

class TravelInsuranceTravelTypeActivitiesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected AxiomTravelInsuranceTravelType $axiom_travel_type,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): array
    {
        return $this->axiom_travel_type
            ->travelInsuranceTravelTypeActivities
            ->map(fn($activity) => [
                'value' => $activity->id,
                'label' => $activity->name,
            ])->toArray();
    }
}
