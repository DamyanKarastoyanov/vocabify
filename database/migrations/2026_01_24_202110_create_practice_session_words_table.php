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
        Schema::create('practice_session_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('word_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('order_index');
            $table->string('result')->nullable(); // 'correct', 'incorrect', 'skipped'
            $table->timestamp('answered_at')->nullable();
            $table->timestamps();

            $table->index('practice_session_id');
            $table->index('word_id');
            $table->index('order_index');
            $table->unique(['practice_session_id', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_session_words');
    }
};
