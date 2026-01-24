<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Unique name for the payment status
            $table->timestamps();
        });

        DB::table('payment_statuses')->insert([
            ['name' => 'Pending'],
            ['name' => 'Verified'],
            ['name' => 'Rejected'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_statuses');
    }
};
