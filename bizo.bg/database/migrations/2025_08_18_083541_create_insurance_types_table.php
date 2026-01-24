<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('insurance_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('code', 10);
            $table->timestamps();
        });

        DB::table('insurance_types')->insert([
            ['name' => 'Застраховка Имущество', 'code' => 'HOME'],
            ['name' => 'Застраховка при Пътуване в Чужбина', 'code' => 'TRAVEL'],
            ['name' => 'Медицинска Застраховка за Чужденци', 'code' => 'NONRES'],
            ['name' => 'Гражданска Отговорност', 'code' => 'MTPL'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurance_types');
    }
};
