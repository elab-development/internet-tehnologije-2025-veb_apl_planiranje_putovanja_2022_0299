<?php

namespace App\Http\Controllers;

use App\Models\Mesto;
use App\Models\Recenzija;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\RecenzijaResource;

class RecenzijaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Mesto $place)
    {
        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page'  => ['sometimes', 'integer', 'min:1'],
        ]);
        $perPage = (int)($validated['per_page'] ?? 15);

        $reviews = Recenzija::query()
            ->where('mesto_id', $place->id)
            ->with(['user'])
            ->latest()
            ->paginate($perPage)
            ->appends($request->query());

        return RecenzijaResource::collection($reviews);

    }

     public function indexByUser(Request $request, User $user)
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ]);
        $perPage = (int)($validated['per_page'] ?? 15);

        $reviews = Recenzija::query()
            ->where('user_id', $user->id)
            ->with(['mesto'])
            ->latest()
            ->paginate($perPage)
            ->appends($request->query());

        return RecenzijaResource::collection($reviews);

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
        $user = Auth::user();
        if (!$user || $user->role !== 'user') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'mesto_id' => ['required', 'integer', 'exists:mesta,id'],
            'ocena' => ['required', 'integer', 'between:1,5'],
            'deskripcija' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $exists = Recenzija::where('user_id', $user->id)
            ->where('mesto_id', $validated['mesto_id'])
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'You have already reviewed this place.'], 422);
        }

        $review = Recenzija::create([
            'user_id' => $user->id,
            'mesto_id' => $validated['mesto_id'],
            'ocena' => $validated['ocena'],
            'deskripcija' => $validated['deskripcija'] ?? null,
        ]);

        $this->recalculatePlaceAggregates($validated['mesto_id']);

        return response()->json([
            'message' => 'Review created successfully',
            'review'  => new RecenzijaResource($review->load('user', 'mesto')),
        ], 201);
    }



    public function show(Recenzija $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recenzija $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recenzija $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recenzija $review)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'user') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ((int)$review->user_id !== (int)$user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $placeId =(int) $review->mesto_id;
        $review->delete();

        $this->recalculatePlaceAggregates($placeId);

        return response()->json(['message' => 'Review deleted successfully']);
    }

    private function recalculatePlaceAggregates(int $placeId): void
    {
        $agg = Recenzija::where('mesto_id', $placeId)
            ->selectRaw('COUNT(*) as cnt, COALESCE(AVG(ocena),0) as avg_ocena')
            ->first();

        $place = Mesto::find($placeId);
        if ($place) {
            $place->broj_recenzija = (int) ($agg->cnt ?? 0);
            $place->prosecna_ocena  = round((float) ($agg->avg_ocena ?? 0), 2);
            $place->save();
        }
    }
}