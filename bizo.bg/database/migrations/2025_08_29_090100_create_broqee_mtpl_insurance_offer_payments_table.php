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
		Schema::create('broqee_mtpl_insurance_offer_payments', function (Blueprint $table) {
			$table->id();
			$table->foreignId('broqee_mtpl_insurance_offer_id');
			$table->foreign('broqee_mtpl_insurance_offer_id', 'fk_mtpl_offer_payment_offer')
				->references('id')->on('broqee_mtpl_insurance_offers')
				->onDelete('cascade');
			$table->integer('number');
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
		Schema::dropIfExists('broqee_mtpl_insurance_offer_payments');
	}
};


