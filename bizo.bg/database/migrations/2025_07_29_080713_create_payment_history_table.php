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
        Schema::create('payment_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // no cascade or set null as the user model uses SoftDeletes
            $table->string('order_number')->index();
            $table->string('gateway_order_id')->nullable()->index();
            $table->bigInteger('amount');
            $table->string('currency', 3);
            $table->string('return_url')->nullable();

            $table->string('registration_status_code')->nullable();
            $table->text('registration_error_message')->nullable();
            $table->json('registration_api_response_json')->nullable();

            $table->string('order_status_code')->nullable();
            $table->string('order_error_code')->nullable();
            $table->text('order_error_message')->nullable();
            $table->json('order_api_response_json')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_history');
    }
};
