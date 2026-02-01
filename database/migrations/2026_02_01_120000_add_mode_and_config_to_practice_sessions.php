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
        Schema::table('practice_sessions', function (Blueprint $table) {
            $table->string('mode')->nullable()->after('user_id');
            $table->json('config')->nullable()->after('items_count');
        });

        Schema::table('practice_sessions', function (Blueprint $table) {
            $table->renameColumn('items_count', 'total_items');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('practice_sessions', function (Blueprint $table) {
            $table->renameColumn('total_items', 'items_count');
        });

        Schema::table('practice_sessions', function (Blueprint $table) {
            $table->dropColumn(['mode', 'config']);
        });
    }
};
