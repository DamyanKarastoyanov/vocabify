<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('users')->where('id', 1)->delete();
        DB::table('users')->insert([
            'id' => 1,
            'name' => 'Captain Bizo',
            'email' => 'cptbizo@bizo.bg',
            'password' => Hash::make(Str::random(32)),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('users')->where('id', 1)->delete();
    }
};
