<?php

use App\Models\Mesto;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('mesta', function (Blueprint $table) {       
            $table->id();
            $table->string('ime');
            $table->string('slug')->unique();
            $table->enum('tip', Mesto::TYPES)->index();
            $table->string('adresa')->nullable();
            $table->decimal('geografska_sirina', 10, 7)->nullable();
            $table->decimal('geografska_duzina', 10, 7)->nullable();
            
            $table->string('slika', 500)->nullable();

            $table->foreignId('destinacija_id')->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('mesta');
    }
};