<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aktivnost extends Model
{
    use HasFactory;    

    protected $fillable = [
        'destinacija_id',
        'naziv',
        'cena',
        'trajanje',
        'opis'
    ];

    public function destinacija(): BelongsTo
    {
         return $this->belongsTo(Destinacija::class);
    }
  

}