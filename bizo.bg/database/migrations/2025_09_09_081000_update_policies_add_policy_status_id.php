<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->foreignId('policy_status_id')->after('axiom_policy_status_id')->nullable()->constrained();
        });
    }

    public function down(): void
    {
        Schema::table('policies', function (Blueprint $table) {
            $table->dropForeign(['policy_status_id']);
            $table->dropColumn('policy_status_id');
        });
    }
};


