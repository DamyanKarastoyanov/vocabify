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
        Schema::create('axiom_home_insurance_properties', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('axiom_town_id')->nullable();
            $table->foreign('axiom_town_id')->references('axiom_id')->on('axiom_towns')->onDelete('cascade');
            $table->foreignId('user_id')->nullable();
            $table->string('address');
            $table->string('size');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_home_insurance_properties');
        Schema::enableForeignKeyConstraints();
    }
};
