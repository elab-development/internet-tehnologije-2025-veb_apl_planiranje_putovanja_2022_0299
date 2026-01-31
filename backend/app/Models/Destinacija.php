<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destinacija extends Model
{
    use HasFactory;    
    
    protected $table = 'destinacije';

    protected $fillable = [
        'ime',
        'drzava',
        'region',
        'slug',
        'opis'
    ];

    public function mesta(): HasMany
    {
        return $this->hasMany(Mesto::class);
    }
    public function aktivnosti(): HasMany
    {
        return $this->hasMany(Aktivnost::class);
    }

}