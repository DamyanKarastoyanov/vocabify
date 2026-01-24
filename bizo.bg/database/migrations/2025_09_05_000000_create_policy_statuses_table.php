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
        Schema::create('policy_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->timestamps();
        });

        DB::table('policy_statuses')->insert([
            ['name' => 'Draft', 'code' => 'draft'],
            ['name' => 'Pending Customer Action', 'code' => 'pending_customer_action'],
            ['name' => 'Pending Insurer Confirmation', 'code' => 'pending_insurer_confirmation'],
            ['name' => 'Awaiting Payment Confirmation', 'code' => 'awaiting_payment_confirmation'],
            ['name' => 'Manual Review', 'code' => 'manual_review'],
            ['name' => 'Active', 'code' => 'active'],
            ['name' => 'Expired', 'code' => 'expired'],
            ['name' => 'Cancelled', 'code' => 'cancelled'],
            ['name' => 'Declined', 'code' => 'declined'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('policy_statuses');
    }
};


