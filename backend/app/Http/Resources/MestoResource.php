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
            'slika' => $this->slika,
            'broj_recenzija' => (int) $this->broj_recenzija,
            'prosecna_ocena' => $this->prosecna_ocena !== null ? (float) $this->prosecna_ocena : null,
            'destinacija' => $this->whenLoaded('destinacija', function () {
                return [
                    'id' => $this->destinacija->id,
                    'ime' => $this->destinacija->ime,
                    'slug' => $this->destinacija->slug,
                    'drzava' => $this->destinacija->drzava,
                    'adresa' => $this->destinacija->adresa,
                    'slika' => $this->destinacija->slika,
                    'prosecna_ocena' => $this->destinacija->prosecna_ocena !== null ? (float) $this->destinacija->prosecna_ocena : null,

                ];
            }),
            'recenzije' => RecenzijaResource::collection($this->whenLoaded('recenzije')),
        ];
    }
}
