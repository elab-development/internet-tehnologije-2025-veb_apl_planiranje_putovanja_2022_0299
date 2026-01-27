<?php

namespace App\Http\Controllers;

use App\Models\Aktivnost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AktivnostController extends Controller
{
    private function ensureAdmin()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return null;
    }

 
    public function index(Request $request)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'destinacija_id' => ['sometimes', 'integer', 'exists:destinacije,id'],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 15);

        $q = Aktivnost::query()
            ->with(['destinacija'])
            ->latest();

        if (isset($validated['destinacija_id'])) {
            $q->where('destinacija_id', $validated['destinacija_id']);
        }

        $aktivnosti = $q->paginate($perPage)->appends($request->query());

        return response()->json($aktivnosti);
    }

    public function show(Aktivnost $aktivnost)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        return response()->json($aktivnost->load('destinacija'));
    }

 
    public function store(Request $request)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        $validated = $request->validate([
            'destinacija_id' => ['required', 'integer', 'exists:destinacije,id'],
            'naziv' => ['required', 'string', 'max:255'],
            'cena' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'trajanje' => ['sometimes', 'nullable', 'string', 'max:255'],
            'opis' => ['sometimes', 'nullable', 'string'],
        ]);

        $aktivnost = Aktivnost::create($validated);

        return response()->json([
            'message' => 'Aktivnost created successfully',
            'aktivnost' => $aktivnost->load('destinacija'),
        ], 201);
    }

    
    public function update(Request $request, Aktivnost $aktivnost)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        $validated = $request->validate([
            'destinacija_id' => ['sometimes', 'integer', 'exists:destinacije,id'],
            'naziv' => ['sometimes', 'string', 'max:255'],
            'cena' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'trajanje' => ['sometimes', 'nullable', 'string', 'max:255'],
            'opis' => ['sometimes', 'nullable', 'string'],
        ]);

        $aktivnost->update($validated);

        return response()->json([
            'message' => 'Aktivnost updated successfully',
            'aktivnost' => $aktivnost->load('destinacija'),
        ]);
    }

  
    public function destroy(Aktivnost $aktivnost)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        $aktivnost->delete();

        return response()->json(['message' => 'Aktivnost deleted successfully']);
    }
}
