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
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->string('remindable_type'); // Policy, Installment, etc. (polymorphic)
            $table->unsignedBigInteger('remindable_id');
            $table->string('type'); // e.g., 'policy_expiry', 'installment_due'
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->unique(['remindable_type', 'remindable_id', 'type'], 'reminder_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
