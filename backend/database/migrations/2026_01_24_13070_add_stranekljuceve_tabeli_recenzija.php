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
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mesto_id')->constrained('mesta')->cascadeOnDelete();

           

         /* $table->foreignId('user_id')
                  ->nullable()
                  ->constrained()      // users.id
                  ->nullOnDelete();    // ako se user obriše, user_id postaje NULL

            // Recenzija mora imati mesto -> place_id obavezan
            $table->foreignId('place_id')
                  ->constrained()      // places.id
                  ->cascadeOnDelete();*/
});
    }

    
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recenzije', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['mesto_id']);
            $table->dropColumn(['user_id', 'mesto_id']);
        });
    }
};