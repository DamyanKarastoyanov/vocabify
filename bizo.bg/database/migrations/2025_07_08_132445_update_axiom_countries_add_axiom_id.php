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
        DB::table('axiom_countries')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Schema::table('axiom_countries', function (Blueprint $table) {
            $table->unsignedBigInteger('axiom_id')->nullable()->unique()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('axiom_countries', function (Blueprint $table) {
            $table->dropColumn('axiom_id');
        });
    }
};
