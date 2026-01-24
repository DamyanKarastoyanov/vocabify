<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $role = Role::where('name', 'admin')->first();
        if ($role) {
            $role->delete();
        }
    }
};
