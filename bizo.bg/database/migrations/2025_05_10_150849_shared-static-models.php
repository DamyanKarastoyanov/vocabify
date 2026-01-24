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
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('axiom_countries');
        Schema::dropIfExists('axiom_districts');
        Schema::dropIfExists('axiom_municipalities');
        Schema::dropIfExists('axiom_towns');
        Schema::dropIfExists('axiom_agent_types');
        Schema::dropIfExists('axiom_agents');
        Schema::dropIfExists('axiom_office_types');
        Schema::dropIfExists('axiom_office_regions');
        Schema::dropIfExists('axiom_offices');
        Schema::dropIfExists('axiom_installment_types');
        Schema::dropIfExists('axiom_customer_types');
        Schema::dropIfExists('axiom_personal_identification_number_types');

        Schema::enableForeignKeyConstraints();

        Schema::create('axiom_countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('axiom_districts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_country_id');
            $table->foreign('axiom_country_id')->references('id')->on('axiom_countries')->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_district_id');
            $table->foreign('axiom_district_id')->references('axiom_id')->on('axiom_districts')->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_towns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('postcode');
            $table->unsignedBigInteger('axiom_municipality_id');
            $table->foreign('axiom_municipality_id')->references('axiom_id')->on('axiom_municipalities')->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_agent_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_agents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('external_code');
            $table->unsignedBigInteger('axiom_agent_type_id');
            $table->foreign('axiom_agent_type_id')->references('axiom_id')->on('axiom_agent_types')->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_office_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_office_regions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_offices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_office_region_id');
            $table->foreign('axiom_office_region_id')->references('axiom_id')->on('axiom_office_regions')->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_installment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_customer_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('axiom_personal_identification_number_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('axiom_id', 20)->nullable()->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('axiom_countries');
        Schema::dropIfExists('axiom_districts');
        Schema::dropIfExists('axiom_municipalities');
        Schema::dropIfExists('axiom_towns');
        Schema::dropIfExists('axiom_agent_types');
        Schema::dropIfExists('axiom_agents');
        Schema::dropIfExists('axiom_office_types');
        Schema::dropIfExists('axiom_office_regions');
        Schema::dropIfExists('axiom_offices');
        Schema::dropIfExists('axiom_installment_types');
        Schema::dropIfExists('axiom_customer_types');
        Schema::dropIfExists('axiom_personal_identification_number_types');

        Schema::enableForeignKeyConstraints();
    }
};
