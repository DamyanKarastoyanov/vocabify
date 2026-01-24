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
        Schema::create('broqee_mtpl_insurance_vehicle_usages', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('broqee_id')->unique();
            $table->string('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broqee_mtpl_insurance_vehicle_usages');
    }
};


