<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('broqee_mtpl_insurance_offers', function (Blueprint $table) {
            $table->string('broqee_order_number')->nullable()->after('order_number');
        });
    }

    public function down(): void
    {
        Schema::table('broqee_mtpl_insurance_offers', function (Blueprint $table) {
            $table->dropColumn('broqee_order_number');
        });
    }
};


