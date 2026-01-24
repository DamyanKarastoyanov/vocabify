<?php

use Domain\Users\Actions\CreateProfileAction;
use Domain\Users\Models\Profile;
use Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('users')->delete(2);

        $createProfileAction = app(CreateProfileAction::class);

        $profile = $createProfileAction->handle([
            'personal_identification_number_type_id' => null,
            'personal_identification_number' => '0000000000',
            'first_name' => 'Admin',
            'last_name' => 'Admin',
        ]);

        DB::table('users')->insert([
            'id' => 2,
            'profile_id' => $profile->id,
            'is_active' => true,
            'email' => 'admin@bizo.bg',
            'password' => '$2y$12$9kjIx8ue7OA1Xo49uSCY1.imJCJqrYuppGS.C1tX9OjvfHLoF0bc6',
            'activated_at' => now(),
        ]);

        $user = User::find(2);
        if ($user) {
            $user->assignRole('admin');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
