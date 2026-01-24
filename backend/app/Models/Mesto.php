<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mesto extends Model
{
    use HasFactory;    use HasFactory;

    protected $fillable = [
        'destinacija_id',
        'ime',
        'tip',
        'adresa',
        'slug',
        'geografska_sirina',
        'geografska_duzina',
        'prosecna_ocena',
        'broj_recenzija',
    ];

    public const TYPES = ['atrakcija', 'restoran', 'hotel'];

    public function destinacija(): BelongsTo
    {
        return $this->belongsTo(Destinacija::class);
    }

    public function recenzije(): HasMany
    {
        return $this->hasMany(Recenzija::class);
    }
}