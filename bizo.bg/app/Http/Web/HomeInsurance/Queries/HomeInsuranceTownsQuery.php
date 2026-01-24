<?php

namespace App\Http\Web\HomeInsurance\Queries;

use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomTown;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class HomeInsuranceTownsQuery
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
        protected int $axiom_municipality_id,
    ) {
        //
    }

    /**
     * Get the results.
     */
    public function get(): Collection
    {
        $actualAxiomMunicipalityId = AxiomMunicipality::query()
            ->where('id', $this->axiom_municipality_id)
            ->select('axiom_id')
            ->value('axiom_id');

        return AxiomTown::query()
            ->where('axiom_municipality_id', $actualAxiomMunicipalityId)
            ->select('id', 'name', 'postcode')
            ->orderBy('name', 'asc')
            ->get();
    }
}
