<?php

use Domain\Payment\Models\PaymentStatus;
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
        Schema::create('bank_transfers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained(); // do nothing on delete
            $table->string('reference_number', 36)->nullable(); // optional field they might input
            $table->decimal('amount', 12, 2);
            $table->foreignId('axiom_currency_id')->nullable()->constrained('axiom_currencies');
            $table->foreignId('payment_status_id')->default(PaymentStatus::STATUSES['PENDING']); // pending, verified, rejected
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->text('notes')->nullable(); // admin or user notes

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_transfers');
    }
};
