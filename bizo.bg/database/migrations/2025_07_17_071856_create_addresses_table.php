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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('district_id')->nullable()->references('id')->on('axiom_districts')->constrained()->onDelete('set null');
            $table->foreignId('municipality_id')->nullable()->references('id')->on('axiom_municipalities')->constrained()->onDelete('set null');
            $table->foreignId('town_id')->nullable()->references('id')->on('axiom_towns')->constrained()->onDelete('set null');

            $table->string('postal_code')->nullable();
            $table->string('address')->nullable();

            $table->unique(['district_id', 'municipality_id', 'town_id', 'postal_code', 'address'], 'unique_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
