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
        Schema::table('aktivnosti', function (Blueprint $table) {
            $table->foreignId('destinacija_id')->constrained('destinacije')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aktivnosti', function (Blueprint $table) {
            $table->dropForeign(['destinacija_id']);
            $table->dropColumn('destinacija_id');
        });
    }
};