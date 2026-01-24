<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		$permission = Permission::firstOrCreate(['name' => 'edit payments']);
		$role = Role::where('name', 'admin')->first();

		if ($role) {
			$role->givePermissionTo($permission);
		}
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		$permission = Permission::where('name', 'edit payments')->first();

		if ($permission) {
			$adminRole = Role::where('name', 'admin')->first();
			if ($adminRole) {
				$adminRole->revokePermissionTo($permission);
			}

			$permission->delete();
		}
	}
};


