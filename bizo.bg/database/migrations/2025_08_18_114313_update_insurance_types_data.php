<?php

use Domain\Insurance\Models\InsuranceType;
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
        InsuranceType::where('code', 'HOME')->update(['name' => 'Застраховка имущество']);
        InsuranceType::where('code', 'TRAVEL')->update(['name' => 'Застраховка при пътуване в чужбина']);
        InsuranceType::where('code', 'NONRES')->update(['name' => 'Медицинска застраховка за чужденци']);
        InsuranceType::where('code', 'MTPL')->update(['name' => 'Гражданска отговорност']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
