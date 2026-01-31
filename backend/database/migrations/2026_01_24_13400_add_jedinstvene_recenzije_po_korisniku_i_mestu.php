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
        Schema::table('recenzije', function (Blueprint $table) {
            $table->unique(['user_id', 'mesto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recenzije', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'mesto_id']);
        });
    }
};