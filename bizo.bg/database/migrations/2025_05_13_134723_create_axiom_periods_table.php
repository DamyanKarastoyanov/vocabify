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
        Schema::create('axiom_home_insurance_periods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->string('name', 50);
            $table->timestamps();
        });

        Artisan::call('axiom:fetch-global-models');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_home_insurance_periods');
        Schema::enableForeignKeyConstraints();
    }
};
