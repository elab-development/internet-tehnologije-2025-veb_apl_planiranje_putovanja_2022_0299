<?php

namespace App\Http\Resources;
use App\Http\Resources\RecenzijaResource;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->when($request->user()?->isAdmin(), $this->email),
            'role' => $this->role,
            'broj_recenzija' => $this->whenCounted('recenzije'),
            'recenzije' => RecenzijaResource::collection($this->whenLoaded('recenzije')),
        ];
    }
}