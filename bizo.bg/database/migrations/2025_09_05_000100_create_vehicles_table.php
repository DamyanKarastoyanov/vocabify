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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('number');
            $table->string('vin');
            $table->string('model_name');
            $table->string('mark_name');
            $table->string('engine_volume');
            $table->unsignedInteger('engine_power_kw');
            $table->date('year');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};


