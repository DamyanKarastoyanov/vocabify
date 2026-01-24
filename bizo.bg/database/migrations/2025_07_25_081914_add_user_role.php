<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Role::firstOrCreate(['name' => 'user']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $role = Role::where('name', 'user')->first();
        if ($role) {
            $role->delete();
        }
    }
};
