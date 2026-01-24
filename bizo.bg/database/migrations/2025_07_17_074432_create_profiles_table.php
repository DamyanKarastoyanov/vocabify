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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('personal_identification_number_type_id')->nullable()->references('id')->on('axiom_personal_identification_number_types')->constrained()->onDelete('set null');
            $table->string('personal_identification_number', 20);
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('latin_full_name', 100)->nullable();
            $table->foreignId('address_id')->nullable()->references('id')->on('addresses')->constrained()->onDelete('set null');
            $table->string('phone', 15)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
