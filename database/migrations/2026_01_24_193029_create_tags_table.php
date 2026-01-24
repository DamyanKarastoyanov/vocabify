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
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dataset_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('name', 64);
            $table->string('slug', 64);
            $table->string('description', 255)->nullable();
            $table->string('color', 32)->nullable();
            $table->timestamps();

            $table->unique(['dataset_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
