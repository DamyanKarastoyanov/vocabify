<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('axiom_non_resident_insurance_customer_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Artisan::call('axiom:fetch-non-resident-insurance-models');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axiom_non_resident_insurance_customer_groups');
    }
};
