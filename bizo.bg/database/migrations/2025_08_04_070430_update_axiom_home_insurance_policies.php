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
            $table->bigInteger('policy_number')->after('axiom_offer_id')->nullable();
            $table->json('api_response_json')->after('policy_number')->nullable();
            $table->foreignId('axiom_district_id')->nullable()->after('axiom_policy_status_id')
                ->references('id')->on('axiom_districts')->constrained()->onDelete('set null');
            $table->foreignId('axiom_municipality_id')->nullable()->after('axiom_district_id')
                ->references('id')->on('axiom_municipalities')->constrained()->onDelete('set null');
            $table->foreignId('axiom_town_id')->nullable()->after('axiom_municipality_id')
                ->references('id')->on('axiom_towns')->constrained()->onDelete('set null');
            $table->string('property_town_type')->nullable();
            $table->string('property_address')->nullable();
            $table->string('property_postal_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_home_insurance_policies', function (Blueprint $table) {

            $table->dropForeign(['axiom_district_id']);
            $table->dropForeign(['axiom_municipality_id']);
            $table->dropForeign(['axiom_town_id']);

            $table->dropColumn([
                'policy_number',
                'api_response_json',
                'axiom_district_id',
                'axiom_municipality_id',
                'axiom_town_id',
                'property_town_type',
                'property_address',
                'property_postal_code',
            ]);
        });
    }
};
