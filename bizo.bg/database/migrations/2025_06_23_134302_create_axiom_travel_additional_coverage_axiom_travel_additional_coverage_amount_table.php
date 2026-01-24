<?php

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
        Schema::create('axiom_travel_additional_coverage_additional_coverage_amount', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('axiom_travel_insurance_additional_coverage_id');
            $table->unsignedBigInteger('axiom_travel_insurance_additional_coverage_amount_id');

            $table->foreign('axiom_travel_insurance_additional_coverage_id', 'fk_travel_insurance_additional_coverage')
                ->references('id')
                ->on('axiom_travel_insurance_additional_coverages')
                ->onDelete('cascade');

            $table->foreign('axiom_travel_insurance_additional_coverage_amount_id', 'fk_travel_insurance_additional_coverage_amount')
                ->references('id')
                ->on('axiom_travel_insurance_additional_coverage_amounts')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_travel_additional_coverage_additional_coverage_amount');
        Schema::enableForeignKeyConstraints();
    }
};
