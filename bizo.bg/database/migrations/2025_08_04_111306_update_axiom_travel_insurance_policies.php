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
        Schema::table('axiom_travel_insurance_policies', function (Blueprint $table) {
            $table->decimal('total_amount', 12, 2)->change();
            $table->foreignId('axiom_offer_id')->after('axiom_id')->nullable()->constrained('axiom_travel_insurance_offers');
            $table->bigInteger('policy_number')->after('axiom_offer_id')->nullable();
            $table->json('api_response_json')->after('policy_number')->nullable();
            $table->foreignId('axiom_travel_insurance_destination_id')->after('axiom_policy_status_id')->nullable();
            $table->foreign('axiom_travel_insurance_destination_id', 'fk_axiom_travel_insurance_destination_id')
                ->references('id')->on('axiom_travel_insurance_destinations')->onDelete('set null');
            $table->foreignId('axiom_travel_insurance_travel_type_id')->after('axiom_travel_insurance_destination_id')->nullable();
            $table->foreign('axiom_travel_insurance_travel_type_id', 'fk_axiom_travel_insurance_travel_type_id')
                ->references('id')->on('axiom_travel_insurance_travel_types')->onDelete('set null');
            $table->foreignId('axiom_travel_insurance_travel_type_activity_id')->nullable()->after('axiom_travel_insurance_travel_type_id');
            $table->foreign('axiom_travel_insurance_travel_type_activity_id', 'fk_axiom_travel_insurance_travel_type_activity_id')
                ->references('id')->on('axiom_travel_insurance_travel_type_activities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_travel_insurance_policies', function (Blueprint $table) {
            $table->integer('total_amount')->change();

            $table->dropForeign(['axiom_offer_id']);
            $table->dropForeign(['axiom_travel_insurance_destination_id']);
            $table->dropForeign(['axiom_travel_insurance_travel_type_id']);
            $table->dropForeign(['axiom_travel_insurance_travel_type_activity_id']);

            $table->dropColumn([
                'axiom_offer_id',
                'policy_number',
                'api_response_json',
                'axiom_travel_insurance_destination_id',
                'axiom_travel_insurance_travel_type_id',
                'axiom_travel_insurance_travel_type_activity_id',
            ]);
        });
    }
};
