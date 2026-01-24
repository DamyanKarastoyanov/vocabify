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
        Schema::table('axiom_home_insurance_policies', function (Blueprint $table) {
            $table->dropUnique(['axiom_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_home_insurance_policies', function (Blueprint $table) {
            $table->unique('axiom_id');
        });
    }
};
