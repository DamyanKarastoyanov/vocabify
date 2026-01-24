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
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropUnique('profiles_pin_and_pin_type_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->unique([
                'personal_identification_number',
                'personal_identification_number_type_id',
            ], 'profiles_pin_and_pin_type_unique');
        });
    }
};
