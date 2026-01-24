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
        Schema::create('mvr_fines_checks', function (Blueprint $table) {
            $table->id();
            $table->string('egn', 10);
            $table->string('driving_licence_number', 20);
            $table->boolean('has_obligations')->default(false);
            $table->decimal('total_amount_bgn', 10, 2)->default(0);
            $table->decimal('total_amount_eur', 10, 2)->default(0);
            $table->json('raw_response')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['egn', 'driving_licence_number']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mvr_fines_checks');
    }
};
