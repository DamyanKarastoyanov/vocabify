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
		Schema::create('broqee_mtpl_insurance_policies', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained()->restrictOnDelete();
			$table->decimal('total_amount', 12, 2)->nullable();
			$table->foreignId('axiom_currency_id')->nullable();
			$table->string('policy_number')->nullable();
			$table->string('insurer_keyword')->nullable();
			$table->foreignId('broqee_mtpl_insurance_offer_id')->nullable();
			$table->json('api_response_json')->nullable();
			$table->date('start_date')->nullable();
			$table->date('end_date')->nullable();
			$table->foreignId('axiom_policy_status_id')->nullable();
			$table->timestamps();

			// Short FK names to satisfy MariaDB 64-char identifier limit
			$table->foreign('axiom_currency_id', 'fk_mtpl_policy_currency')
				->references('id')->on('axiom_currencies');
			$table->foreign('broqee_mtpl_insurance_offer_id', 'fk_mtpl_policy_offer')
				->references('id')->on('broqee_mtpl_insurance_offers');
			$table->foreign('axiom_policy_status_id', 'fk_mtpl_policy_status')
				->references('id')->on('axiom_policy_statuses');
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::disableForeignKeyConstraints();
		Schema::dropIfExists('broqee_mtpl_insurance_policies');
		Schema::enableForeignKeyConstraints();
	}
};


