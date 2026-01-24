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
        Schema::create('vehicle_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('mark')->nullable();
            $table->string('model')->nullable();
            $table->string('engine_volume')->nullable();
            $table->string('engine_power')->nullable();
            $table->unsignedInteger('manufactured_year')->nullable();
            $table->string('euro_standard')->nullable();
            $table->enum('wheel_direction', ['left', 'right'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_specifications');
    }
};
