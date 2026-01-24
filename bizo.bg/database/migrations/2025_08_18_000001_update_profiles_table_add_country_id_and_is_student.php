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
		Schema::table('profiles', function (Blueprint $table) {
			$table->foreignId('country_id')->after('address_id')->nullable()->onDelete('set null');
			$table->boolean('is_student')->after('phone')->nullable()->default(false);
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::table('profiles', function (Blueprint $table) {
			$table->dropForeign(['country_id']);
			$table->dropColumn(['country_id', 'is_student']);
		});
	}
};


