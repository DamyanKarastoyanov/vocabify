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
        Schema::create('axiom_travel_insurance_amounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axiom_travel_insurance_amounts');
    }
};
