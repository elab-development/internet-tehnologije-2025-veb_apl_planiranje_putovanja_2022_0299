<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecenzijaResource extends JsonResource
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
            'user_id' => $this->user_id,
            'mesto_id' => $this->mesto_id,
            'ocena' => (int) $this->ocena,
            'deskripcija' => $this->deskripcija,
            'datum' => $this->created_at,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'ime' => $this->user->ime,
                    'role' => $this->user->role,
                ];
            }),
            'mesto' => $this->whenLoaded('mesto', function () {
                return [
                    'id' => $this->mesto->id,
                    'ime' => $this->mesto->ime,
                    'slug' => $this->mesto->slug,
                    'tip' => $this->mesto->tip,
                ];
            }),
        ];
    }
}
