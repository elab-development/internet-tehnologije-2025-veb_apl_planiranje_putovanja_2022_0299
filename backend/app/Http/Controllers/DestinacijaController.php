<?php

namespace App\Http\Controllers;

use App\Models\Destinacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Http\Resources\DestinacijaResource;

class DestinacijaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $sortBy = $request->query('sort_by', 'ime');
        $sortDir = strtolower($request->query('sort_direction', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSort = ['ime', 'drzava', 'region', 'created_at', 'mesta_count', 'aktivnosti_count'];

        if (! in_array($sortBy, $allowedSort, true)) {
            return response()->json([
                'message' => "Invalid sort_by. Allowed: " . implode(',', $allowedSort),
            ], 422);
        }

        $query = Destinacija::query();

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('ime', 'like', "%{$q}%")
                    ->orWhere('drzava', 'like', "%{$q}%")
                    ->orWhere('region', 'like', "%{$q}%");
            });
        }

       if ($sortBy === 'mesta_count') {
            $query->withCount('mesta')->orderBy('mesta_count', $sortDir);
        } elseif ($sortBy === 'aktivnosti_count') {
            $query->withCount('aktivnosti')->orderBy('aktivnosti_count', $sortDir);
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        $destinations = $query->get();

        if ($destinations->isEmpty()) {
            return response()->json(['message' => 'No destinations found!'], 404);    
        }

        return response()->json([

            'count' => $destinations->count(),
            'destinations' => DestinacijaResource::collection($destinations),
        ]);
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
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'ime' => ['required', 'string', 'max:255'],
            'drzava' => ['required', 'string', 'max:255'],
            'region' => ['sometimes', 'nullable', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:destinacije,slug'],
            'opis' => ['sometimes', 'nullable', 'string'],
        ]);

        $slug = $validated['slug'] ?? Str::slug(($validated['ime'] ?? '') . '-' . ($validated['drzava'] ?? ''));
        $base = $slug;
        $i = 1;
        while (Destinacija::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        $validated['slug'] = $slug;

        $destination = Destinacija::create($validated);

        return response()->json([
            'message' => 'Destination created successfully',
            'destination' => new DestinacijaResource($destination),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Destinacija $destination)
    {
        $destination->load(['mesta', 'aktivnosti']);
        $destination->loadCount(['mesta', 'aktivnosti']);

        return response()->json([
            'destination' => new DestinacijaResource($destination),

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Destinacija $destination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Destinacija $destination)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'ime' => ['sometimes', 'string', 'max:255'],
            'drzava' => ['sometimes', 'string', 'max:255'],
            'region' => ['sometimes', 'nullable', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('destinacije', 'slug')->ignore($destination->id)
            ],
            'opis' => ['sometimes', 'nullable', 'string'],
        ]);

        if (!array_key_exists('slug', $validated) && (array_key_exists('ime', $validated) || array_key_exists('drzava', $validated))) {
            $newName = $validated['ime'] ?? $destination->ime;
            $newCountry = $validated['drzava'] ?? $destination->drzava;
            $slug = Str::slug($newName . '-' . $newCountry);

            if ($slug !== $destination->slug) {
                $base = $slug;
                $i = 1;
                while (Destinacija::where('slug', $slug)->where('id', '!=', $destination->id)->exists()) {
                    $slug = $base . '-' . $i++;
                }
                $validated['slug'] = $slug;
            }
        }

        if (empty($validated)) {
            return response()->json([
                'message' => 'Nothing to update',
                'destination' => $destination,
            ]);
        }

        $destination->update($validated);

        return response()->json([
            'message' => 'Destination updated successfully',
            'destination' => new DestinacijaResource($destination),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Destinacija $destination)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $destination->delete();
        return response()->json(['message' => 'Destination deleted successfully']);
    }
}


