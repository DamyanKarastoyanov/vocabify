<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Optional: per-user per-word stats for "what should I show next", spaced repetition, etc.
     * Update this table when saving practice_session_items if you want fast aggregates.
     */
    public function up(): void
    {
        Schema::create('word_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('word_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('times_seen')->default(0);
            $table->unsignedInteger('times_correct')->default(0);
            $table->timestamp('last_seen_at')->nullable();
            $table->unsignedInteger('streak')->default(0); // consecutive correct answers
            $table->float('easiness')->nullable(); // for spaced repetition later
            $table->timestamps();

            $table->unique(['user_id', 'word_id']);
            $table->index('user_id');
            $table->index('word_id');
            $table->index('last_seen_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('word_stats');
    }
};
