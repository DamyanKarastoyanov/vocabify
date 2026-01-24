<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class HomeInsuranceMunicipalitiesQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected int $axiom_district_id,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): Collection
    {
        $actualAxiomDistrictId = AxiomDistrict::query()
            ->where('id', $this->axiom_district_id)
            ->select('axiom_id')
            ->value('axiom_id');

        return AxiomMunicipality::query()
            ->where('axiom_district_id', $actualAxiomDistrictId)
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();
    }
}
