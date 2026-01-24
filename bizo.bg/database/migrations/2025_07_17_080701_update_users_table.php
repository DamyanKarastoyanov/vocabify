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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('profile_id')->after('id')->nullable()->constrained('profiles')->onDelete('set null');
            $table->boolean('is_active')->default(true)->after('profile_id');
            $table->softDeletes()->after('updated_at');
            $table->dropColumn(['name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['profile_id']);
            $table->dropColumn(['profile_id', 'is_active', 'deleted_at']);
            $table->dropSoftDeletes();
            $table->string('name')->after('id')->nullable();
        });
    }
};
