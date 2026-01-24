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
            $table->foreignId('axiom_offer_id')->after('axiom_id')->nullable()->constrained('axiom_home_insurance_offers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_home_insurance_policies', function (Blueprint $table) {
            $table->dropForeign(['axiom_offer_id']);
            $table->dropColumn('axiom_offer_id');
        });
    }
};
