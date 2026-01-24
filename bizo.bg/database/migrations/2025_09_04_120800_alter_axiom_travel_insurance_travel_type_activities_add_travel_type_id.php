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
        DB::table('axiom_travel_insurance_travel_type_activities')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::table('axiom_travel_insurance_travel_type_activities', function (Blueprint $table) {
            // Drop unique constraint on axiom_id
            $table->dropUnique('axiom_travel_insurance_travel_type_activities_axiom_id_unique');

            // Add travel_type_id and FK
            $table->unsignedBigInteger('travel_type_id')->after('axiom_id');
            $table->foreign('travel_type_id', 'axi_tta_travel_type_id_fk')
                ->references('id')
                ->on('axiom_travel_insurance_travel_types')
                ->onDelete('cascade');

            // Add composite unique index for (travel_type_id, axiom_id)
            $table->unique(['travel_type_id', 'axiom_id'], 'axiom_travel_type_activity_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_travel_insurance_travel_type_activities', function (Blueprint $table) {
            // Drop foreign key first (it relies on the composite index)
            $table->dropForeign('axi_tta_travel_type_id_fk');

            // Now drop composite unique index
            $table->dropUnique('axiom_travel_type_activity_unique');

            // Drop the column
            $table->dropColumn('travel_type_id');

            // Restore unique constraint on axiom_id
            $table->unique('axiom_id');
        });
    }
};


