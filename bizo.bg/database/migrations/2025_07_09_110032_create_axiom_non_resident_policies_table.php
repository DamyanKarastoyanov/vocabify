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
        Schema::create('axiom_non_resident_insurance_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('axiom_id')->nullable();// ->unique(); not unique for easier testing
            // Note: The unique constraint is commented out to allow multiple policies with the same axiom_id for testing purposes.
            $table->integer('total_amount')->nullable();
            $table->unsignedBigInteger('axiom_currency_id')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->unsignedBigInteger('axiom_policy_status_id')->nullable();
            $table->foreign('axiom_policy_status_id', 'fk_axiom_policy_status')->references('id')->on('axiom_policy_statuses')->onDelete('cascade');
            $table->foreign('axiom_currency_id', 'fk_axiom_currency')->references('id')->on('axiom_currencies')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_non_resident_insurance_policies');
        Schema::enableForeignKeyConstraints();
    }
};
