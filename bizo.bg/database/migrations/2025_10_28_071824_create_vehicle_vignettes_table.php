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
        Schema::create('vehicle_vignettes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->string('country', 2)->default('BG');
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->string('vignette_number')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('vehicle_id');
            $table->index('valid_to');
            $table->index(['vehicle_id', 'valid_to']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_vignettes');
    }
};
