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
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('installments')->truncate();
        DB::table('policies')->truncate();
        DB::table('axiom_home_insurance_offers')->truncate();
        DB::table('axiom_home_insurance_policies')->truncate();
        DB::table('axiom_travel_insurance_offers')->truncate();
        DB::table('axiom_travel_insurance_policies')->truncate();
        DB::table('axiom_non_resident_insurance_offers')->truncate();
        DB::table('axiom_non_resident_insurance_policies')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::table('policies', function (Blueprint $table) {
            $table->decimal('total_amount', 12, 2)->nullable()->after('policy_number');
            $table->foreignId('axiom_currency_id')->nullable()->after('total_amount')->references('id')->on('axiom_currencies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropForeign(['axiom_currency_id']);
            $table->dropColumn('axiom_currency_id');
            $table->dropColumn('total_amount');
        });
    }
};
