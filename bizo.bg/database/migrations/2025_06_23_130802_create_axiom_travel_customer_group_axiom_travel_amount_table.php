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
        Schema::create('axiom_travel_customer_group_axiom_travel_amount', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('axiom_travel_insurance_customer_group_id');
            $table->unsignedBigInteger('axiom_travel_insurance_amount_id');

            $table->foreign('axiom_travel_insurance_customer_group_id', 'fk_travel_customer_group')
                ->references('id')
                ->on('axiom_travel_insurance_customer_groups')
                ->onDelete('cascade');

            $table->foreign('axiom_travel_insurance_amount_id', 'fk_travel_amount')
                ->references('id')
                ->on('axiom_travel_insurance_amounts')
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
        Schema::dropIfExists('axiom_travel_customer_group_axiom_travel_amount');
        Schema::enableForeignKeyConstraints();
    }
};
