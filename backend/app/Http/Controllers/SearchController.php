<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mesto;
use App\Models\Destinacija;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json(['error' => 'Morate uneti pojam za pretragu'], 400);
        }

        $mesta = Mesto::whereHas('destinacija', function($q) use ($query) {
            $q->where('ime', 'like', '%' . $query . '%');
        })
        ->orWhere('ime', 'like', '%' . $query . '%') 
        ->with('destinacija') 
        ->get();

        if ($mesta->isNotEmpty()) {
            return response()->json([
                'source' => 'database',
                'count' => $mesta->count(),
                'data' => $mesta
            ]);
        }

        return response()->json([
            'source' => 'database',
            'count' => 0,
            'message' => 'Nema podataka u lokalnoj bazi za ovaj grad.',
            'data' => []
        ]);
    }
}