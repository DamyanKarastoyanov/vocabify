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
        Schema::table('axiom_travel_insurance_offers', function (Blueprint $table) {
            $table->string('order_number', 36)->nullable()->after('axiom_id')->index();
            $table->decimal('amount', 12, 2)->nullable()->after('order_number');
            $table->foreignId('axiom_currency_id')->nullable()->constrained('axiom_currencies')->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_travel_insurance_offers', function (Blueprint $table) {
            $table->dropForeign(['axiom_currency_id']);
            $table->dropColumn(['order_number', 'amount', 'axiom_currency_id']);
        });
    }
};
