<?php

namespace App\Http\Controllers;

use App\Models\Destinacija;
use App\Models\Mesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class MestoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'tip' => ['sometimes', Rule::in(Mesto::TYPES)],
            'destinacija_id' => ['sometimes', 'integer', 'exists:destinacije,id'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);

        $perPage = (int)($validated['per_page'] ?? 15);

        $query = Mesto::query()
            ->with(['destinacija'])
            ->withCount('recenzije');

        if (array_key_exists('tip', $validated)) {
            $query->where('tip', $validated['tip']);
        }

     

        if (array_key_exists('destinacija_id', $validated)) {
            $query->where('destinacija_id', $validated['destinacija_id']);
        }

        $query->orderBy('created_at', 'desc');

        $places = $query->paginate($perPage)->appends($request->query());

        return response()->json($places);
        }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::check() || !in_array(Auth::user()->role, ['admin', 'moderator'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);  
        }

        $validated = $request->validate([
            'destinacija_id' => ['required', 'integer', 'exists:destinacije,id'],
            'ime' => ['required', 'string', 'max:255'],
            'tip' => ['required', Rule::in(Mesto::TYPES)],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:mesta,slug'],
            'adresa' => ['sometimes', 'nullable', 'string', 'max:255'],
            'geografska_sirina' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'geografska_duzina' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
        ]);

        $baseSlug = $validated['slug'] ?? Str::slug(($validated['ime'] ?? '') . '-' . (optional(Destinacija::find($validated['destinacija_id']))?->slug ?? ''));
        $slug = $baseSlug;
        $i = 1;
        while ($slug && Mesto::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }
        $validated['slug'] = $slug ?: Str::slug($validated['ime'] . '-' . Str::random(6));


       $place = Mesto::create($validated);
       $place->load('destinacija')->loadCount('recenzije');

return response()->json([
    'message' => 'Place created successfully',
    'place' => $place,
], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(Mesto $place)
    {
        $place->load(['destinacija'])->loadCount('recenzije');

        return response()->json([      

        'place' => $place,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mesto $place)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mesto $place)
    {
        if (!Auth::check() || !in_array(Auth::user()->role, ['admin', 'moderator'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);         
        }

        $validated = $request->validate([
            'destinacija_id' => ['sometimes', 'integer', 'exists:destinacije,id'],
            'ime' => ['sometimes', 'string', 'max:255'],
            'tip' => ['sometimes', Rule::in(Mesto::TYPES)],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('mesta', 'slug')->ignore($place->id)],
            'adresa' => ['sometimes', 'nullable', 'string', 'max:255'],
            'geografska_sirina' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'geografska_duzina' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
        ]);

        if (!array_key_exists('slug', $validated) && (array_key_exists('ime', $validated) || array_key_exists('destinacija_id', $validated))) {
            $newName = $validated['ime'] ?? $place->ime;
            $destId  = $validated['destinacija_id'] ?? $place->destinacija_id;
            $dest    = Destinacija::find($destId);
            $suggest = Str::slug($newName . '-' . ($dest?->slug ?? ''));
            if ($suggest !== $place->slug) {
                $base = $suggest;
                $i = 1;
                $slug = $suggest;
                while (Mesto::where('slug', $slug)->where('id', '!=', $place->id)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $validated['slug'] = $slug;
            }
        }

        if (empty($validated)) {
            return response()->json([       
                'message' => 'Nothing to update',
'place'=>$place
            ]);
        }

        $place->update($validated);

        return response()->json([     
            'message' => 'Place updated successfully',
            'place'   => $place,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mesto $place)
    {
        if (!Auth::check() || !in_array(Auth::user()->role, ['admin', 'moderator'], true)) {
            return response()->json(['message' => 'Unauthorized'], 403);      
        }

        $place->delete();

        return response()->json(['message' => 'Place deleted successfully']);       
    }
}
