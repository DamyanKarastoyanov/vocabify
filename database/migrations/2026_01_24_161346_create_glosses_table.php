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
        Schema::create('glosses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('word_id')->constrained()->cascadeOnDelete();
            $table->string('language_code', 5);
            $table->text('meaning_text');
            $table->enum('role', ['middle', 'native', 'other']);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->index('word_id');
        });

        // Note: MySQL doesn't support partial unique indexes directly.
        // The constraint "max one middle and one native gloss per word" 
        // will be enforced at the application level (model validation/events).
        // Multiple 'other' role glosses are allowed.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('glosses');
    }
};
