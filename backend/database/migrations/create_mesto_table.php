<?php

use App\Models\Mesto;
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
        Schema::create('mesta', function (Blueprint $table) {       
            $table->id();
            $table->string('ime');
            $table->string('slug')->unique();
            $table->enum('tip', Mesto::TYPES)->index();
            $table->string('adresa')->nullable();
            $table->decimal('geografska_sirina', 10, 7)->nullable();
            $table->decimal('geografska_duzina', 10, 7)->nullable();
            $table->unsignedTinyInteger('prosecna_ocena')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mesta');
    }
};