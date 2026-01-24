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
        Schema::create('installment_guest_payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('token')->unique();
            $table->foreignId('installment_id')->unique()->constrained()->onDelete('cascade');
            $table->timestamp('expires_at');
            $table->timestamp('accessed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('installment_guest_payments');
    }
};
