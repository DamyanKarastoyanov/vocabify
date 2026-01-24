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
		Schema::create('broqee_mtpl_insurance_offers', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained('users'); // do nothing on delete
			$table->string('order_number');
			$table->json('api_response_json');
			$table->json('api_request_dto_json');
			$table->integer('status');
			$table->string('total');
			$table->string('total_bgn');
			$table->string('total_eur');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('broqee_mtpl_insurance_offers');
	}
};


