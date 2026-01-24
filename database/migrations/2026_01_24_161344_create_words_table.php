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
        Schema::create('words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dataset_id')->constrained()->cascadeOnDelete();
            $table->string('target_language_code', 5);
            $table->string('primary_reading');
            $table->string('alternative_writing')->nullable();
            $table->string('romanization')->nullable();
            $table->timestamps();

            $table->index('dataset_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('words');
    }
};
