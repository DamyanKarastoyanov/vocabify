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
        Schema::create('axiom_bank_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();

            $table->unsignedBigInteger('axiom_bank_id');
            $table->foreign('axiom_bank_id')->references('id')->on('axiom_banks')->onDelete('cascade');

            $table->string('first_name');
            $table->string('last_name');
            $table->string('personal_identification_number');

            $table->unsignedBigInteger('personal_identification_number_type_id')->nullable();
            $table->foreign('personal_identification_number_type_id', 'abd_pin_type_id_foreign')->references('id')->on('axiom_personal_identification_number_types')->onDelete('set null');

            $table->unsignedBigInteger('district_id')->nullable();
            $table->foreign('district_id')->references('id')->on('axiom_districts')->onDelete('set null');

            $table->unsignedBigInteger('municipality_id')->nullable();
            $table->foreign('municipality_id')->references('id')->on('axiom_municipalities')->onDelete('set null');

            $table->unsignedBigInteger('town_id')->nullable();
            $table->foreign('town_id')->references('id')->on('axiom_towns')->onDelete('set null');

            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('mobile_phone')->nullable();
            $table->string('email')->nullable();
            $table->string('postcode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_bank_details');
        Schema::enableForeignKeyConstraints();
    }
};
