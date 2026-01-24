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
        Schema::create('axiom_currency_axiom_insurance_type', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('axiom_insurance_type_id');
            $table->unsignedBigInteger('axiom_currency_id');

            $table->foreign('axiom_insurance_type_id', 'fk_insurance_type')
                ->references('id')
                ->on('axiom_insurance_types')
                ->onDelete('cascade');

            $table->foreign('axiom_currency_id', 'fk_currency')
                ->references('id')
                ->on('axiom_currencies')
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
        Schema::dropIfExists('axiom_currency_axiom_insurance_type');
        Schema::enableForeignKeyConstraints();
    }
};
