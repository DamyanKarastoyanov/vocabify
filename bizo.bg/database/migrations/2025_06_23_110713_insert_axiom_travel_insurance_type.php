<?php

use Domain\Axiom\Global\Models\AxiomInsuranceType;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        AxiomInsuranceType::updateOrCreate(
            ['axiom_id' => AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID],
            [
                'name' => 'AXI TRAVEL',
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        AxiomInsuranceType::where('axiom_id', AxiomInsuranceType::TRAVEL_INSURANCE_TYPE_AXIOM_ID)->delete();
    }
};
