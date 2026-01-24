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
        Schema::create('vehicle_mtpl_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->boolean('has_valid_insurance')->default(false);
            $table->string('insurer')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_mtpl_checks');
    }
};
