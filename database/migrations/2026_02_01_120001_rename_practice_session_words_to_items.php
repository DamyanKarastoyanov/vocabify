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
        Schema::rename('practice_session_words', 'practice_session_items');

        Schema::table('practice_session_items', function (Blueprint $table) {
            $table->renameColumn('order_index', 'position');
            $table->string('shown_side')->nullable()->after('position');
            $table->boolean('is_correct')->nullable()->after('shown_side');
            $table->unsignedInteger('response_ms')->nullable()->after('is_correct');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('practice_session_items', function (Blueprint $table) {
            $table->dropColumn(['shown_side', 'is_correct', 'response_ms']);
            $table->renameColumn('position', 'order_index');
        });

        Schema::rename('practice_session_items', 'practice_session_words');
    }
};
