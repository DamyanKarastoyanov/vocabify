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
        Schema::table('policies', function (Blueprint $table) {
            $table->string('policy_number')->after('user_id')->nullable();
            $table->date('start_date')->after('policy_number')->nullable();
            $table->date('end_date')->after('start_date')->nullable();
            $table->string('title')->after('end_date')->nullable();
            $table->foreignId('axiom_policy_status_id')->after('title')->nullable()->constrained('axiom_policy_statuses', 'id')->onDelete('set null');
            $table->foreignId('insurance_company_id')->after('axiom_policy_status_id')->nullable()->constrained('insurance_companies', 'id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropForeign(['axiom_policy_status_id']);
            $table->dropColumn([
                'policy_number',
                'start_date',
                'end_date',
                'title',
                'axiom_policy_status_id',
            ]);
        });
    }
};
