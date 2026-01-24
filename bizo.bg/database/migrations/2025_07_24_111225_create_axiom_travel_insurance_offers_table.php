<?php

use Domain\Axiom\TravelInsurance\Models\AxiomTravelInsuranceOffer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('axiom_travel_insurance_offers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();

            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('api_response_json')->nullable();
            $table->integer('status')->default(AxiomTravelInsuranceOffer::STATUS['PENDING']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axiom_travel_insurance_offers');
    }
};
