<?php

use Domain\Axiom\Global\Models\AxiomAgent;
use Domain\Axiom\Global\Models\AxiomAgentType;
use Domain\Axiom\Global\Models\AxiomCountry;
use Domain\Axiom\Global\Models\AxiomCustomerType;
use Domain\Axiom\Global\Models\AxiomDistrict;
use Domain\Axiom\Global\Models\AxiomInstallmentType;
use Domain\Axiom\Global\Models\AxiomMunicipality;
use Domain\Axiom\Global\Models\AxiomOffice;
use Domain\Axiom\Global\Models\AxiomOfficeRegion;
use Domain\Axiom\Global\Models\AxiomOfficeType;
use Domain\Axiom\Global\Models\AxiomPersonalIdentificationNumberType;
use Domain\Axiom\Global\Models\AxiomTown;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        if (!AxiomCountry::where('id', 1)->exists()) {
            AxiomCountry::create([
                'id' => 1,
                'name' => 'България',
            ]);
        }

        Artisan::call('axiom:fetch-global-models');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        AxiomCountry::where('id', 1)->delete();
        AxiomDistrict::truncate();
        AxiomMunicipality::truncate();
        AxiomTown::truncate();
        AxiomAgentType::truncate();
        AxiomAgent::truncate();
        AxiomOfficeType::truncate();
        AxiomOfficeRegion::truncate();
        AxiomOffice::truncate();
        AxiomInstallmentType::truncate();
        AxiomCustomerType::truncate();
        AxiomPersonalIdentificationNumberType::truncate();

        Schema::enableForeignKeyConstraints();
    }
};
