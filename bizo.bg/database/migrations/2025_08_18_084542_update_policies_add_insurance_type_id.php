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
        Schema::table('policies', function (Blueprint $table) {
            $table->foreignId('insurance_type_id')->after('insurable_id')->nullable()->constrained('insurance_types')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropForeign(['insurance_type_id']);
            $table->dropColumn('insurance_type_id');
        });
    }
};
