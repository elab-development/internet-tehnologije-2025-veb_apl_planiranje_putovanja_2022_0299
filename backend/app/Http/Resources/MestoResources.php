<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\RecenzijaResource;

class MestoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array    
    {
        return [
            'id' => $this->id,
            'destinacija_id' => $this->destinacija_id,
            'ime' => $this->ime,
            'tip' => $this->tip,
            'slug' => $this->slug,
            'adresa' => $this->adresa,
            'geografska_sirina' => $this->geografska_sirina,
            'geografska_duzina' => $this->geografska_duzina,
            'prosecna_ocena' => $this->prosecna_ocena,
            'broj_recenzija' => (int) $this->broj_recenzija,
        
            'destinacija' => $this->whenLoaded('destinacija', function () {
                return [
                    'id' => $this->destinacija->id,
                    'ime' => $this->destinacija->ime,
                    'slug' => $this->destinacija->slug,
                    'drzava' => $this->destinacija->drzava,
                ];
            }),
            'recenzije' => RecenzijaResource::collection($this->whenLoaded('recenzije')),
        ];
    }
}
