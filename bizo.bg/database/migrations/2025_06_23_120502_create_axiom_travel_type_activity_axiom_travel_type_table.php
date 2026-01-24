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
        Schema::create('axiom_travel_type_axiom_travel_type_activity', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('axiom_travel_insurance_travel_type_id');
            $table->unsignedBigInteger('axiom_travel_insurance_travel_type_activity_id');

            $table->foreign('axiom_travel_insurance_travel_type_id', 'fk_travel_type')
                ->references('id')
                ->on('axiom_travel_insurance_travel_types')
                ->onDelete('cascade');

            $table->foreign('axiom_travel_insurance_travel_type_activity_id', 'fk_travel_type_activity')
                ->references('id')
                ->on('axiom_travel_insurance_travel_type_activities')
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
        Schema::dropIfExists('axiom_travel_insurance_travel_type_axiom_travel_insurance_travel_type_activity');
        Schema::enableForeignKeyConstraints();
    }
};
