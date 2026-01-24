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
        Schema::create('mvr_fines_obligations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mvr_fines_check_id')->constrained('mvr_fines_checks')->cascadeOnDelete();
            $table->string('document_number', 50)->nullable();
            $table->string('document_type', 50)->nullable();
            $table->date('issue_date')->nullable();
            $table->boolean('is_served')->default(false);
            $table->string('reg_number', 20)->nullable();
            $table->date('violation_date')->nullable();
            $table->text('violation')->nullable();
            $table->decimal('amount_bgn', 10, 2)->default(0);
            $table->decimal('discount_bgn', 10, 2)->default(0);
            $table->decimal('amount_to_pay_bgn', 10, 2)->default(0);
            $table->decimal('amount_eur', 10, 2)->default(0);
            $table->date('valid_until')->nullable();
            $table->date('obligation_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mvr_fines_obligations');
    }
};
