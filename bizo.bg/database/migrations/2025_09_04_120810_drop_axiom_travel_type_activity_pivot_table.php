<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('axiom_travel_type_axiom_travel_type_activity');
        Schema::enableForeignKeyConstraints();
        Artisan::call('axiom:fetch-global-models');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank; table was removed permanently.
    }
};


