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
        Schema::create('axiom_non_resident_insurance_offers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('axiom_id')->nullable()->unique();
            $table->foreignId('user_id')->constrained();
            $table->string('order_number', 36)->nullable()->index();
            $table->decimal('amount', 12, 2)->nullable();
            $table->foreignId('axiom_currency_id')->nullable()->constrained('axiom_currencies');
            $table->json('api_response_json')->nullable();
            $table->integer('status')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('axiom_non_resident_insurance_offers');
    }
};
