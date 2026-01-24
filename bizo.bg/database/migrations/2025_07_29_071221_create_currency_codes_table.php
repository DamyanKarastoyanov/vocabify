<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('currency_codes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('alphabetic_code', 3)->unique();
            $table->string('numeric_code', 3)->unique();
        });

        DB::table('currency_codes')->insert([
            ['name' => 'US Dollar', 'alphabetic_code' => 'USD', 'numeric_code' => '840'],
            ['name' => 'Euro', 'alphabetic_code' => 'EUR', 'numeric_code' => '978'],
            ['name' => 'Bulgarian Lev', 'alphabetic_code' => 'BGN', 'numeric_code' => '975'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currency_codes');
    }
};
