<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AktivnostResource extends JsonResource
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
            'naziv' => $this->naziv,
            'cena' => $this->cena !== null ? (float) $this->cena : null,
            'trajanje' => $this->trajanje,
            'opis' => $this->when($this->opis, $this->opis),

            'destinacija' => $this->whenLoaded('destinacija', function () {
                return [
                    'id' => $this->destinacija->id,
                    'ime' => $this->destinacija->ime,
                    'slug' => $this->destinacija->slug,
                    'drzava' => $this->destinacija->drzava,
                    'region' => $this->destinacija->region,
                ];
            }),
        ];
    }
}
