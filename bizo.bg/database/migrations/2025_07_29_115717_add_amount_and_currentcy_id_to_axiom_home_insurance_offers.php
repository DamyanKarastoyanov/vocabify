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
        Schema::table('axiom_home_insurance_offers', function (Blueprint $table) {
            $table->bigInteger('amount')->nullable()->after('order_number');
            $table->foreignId('axiom_currency_id')->nullable()->constrained('axiom_currencies')->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_home_insurance_offers', function (Blueprint $table) {
            $table->dropForeign(['axiom_currency_id']);
            $table->dropColumn(['amount', 'axiom_currency_id']);
        });
    }
};
