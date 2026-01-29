<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\MestoResource;


class DestinacijaResource extends JsonResource
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
            'ime' => $this->ime,
            'drzava' => $this->drzava,
            'region' => $this->region,
            'slug' => $this->slug,
            'opis' => $this->when($this->opis, $this->opis),
            'mesta_count' => $this->whenCounted('mesta'),
            'mesta' => MestoResource::collection($this->whenLoaded('mesta')),
        ];
    }
}
