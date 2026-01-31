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
        Schema::table('mesta', function (Blueprint $table) {
            $table->decimal('prosecna_ocena', 3, 2)->default(0.00);
            $table->unsignedInteger('broj_recenzija')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mesta', function (Blueprint $table) {
            $table->dropColumn(['prosecna_ocena', 'broj_recenzija']);
        });
    }
};