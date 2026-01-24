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
        Schema::table('axiom_non_resident_insurance_policies', function (Blueprint $table) {
            $table->decimal('total_amount', 12, 2)->change();
            $table->foreignId('axiom_offer_id')->after('axiom_id')->nullable()->constrained('axiom_non_resident_insurance_offers');
            $table->bigInteger('policy_number')->after('axiom_offer_id')->nullable();
            $table->json('api_response_json')->after('policy_number')->nullable();
            $table->string('insured_first_name')->after('api_response_json')->nullable();
            $table->string('insured_last_name')->after('insured_first_name')->nullable();
            $table->string('insured_pin')->after('insured_last_name')->nullable();
            $table->string('insured_count')->after('insured_pin')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_non_resident_insurance_policies', function (Blueprint $table) {
            $table->integer('total_amount')->change();

            $table->dropForeign(['axiom_offer_id']);

            $table->dropColumn([
                'axiom_offer_id',
                'policy_number',
                'api_response_json',
                'insured_first_name',
                'insured_last_name',
                'insured_pin',
                'insured_count',
            ]);
        });
    }
};
