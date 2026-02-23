<?php



namespace App\Http\Controllers;

use App\Models\Aktivnost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AktivnostResource;


class AktivnostController extends Controller
{

    /**
 * @OA\Get(
 * path="/api/aktivnosti",
 * summary="Prikaz svih aktivnosti",
 * tags={"Aktivnosti"},
 * @OA\Response(response=200, description="Lista aktivnosti")
 * )
 */

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
       // if ($resp = $this->ensureAdmin()) return $resp;

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

        return AktivnostResource::collection($aktivnosti);

    }

    public function show(Aktivnost $aktivnost)
    {
       // if ($resp = $this->ensureAdmin()) return $resp;

        return new AktivnostResource($aktivnost->load('destinacija'));
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
            'aktivnost' => new AktivnostResource($aktivnost->load('destinacija')),
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
            'aktivnost' => new AktivnostResource($aktivnost->load('destinacija')),
        ]);
    }

  
    public function destroy(Aktivnost $aktivnost)
    {
        if ($resp = $this->ensureAdmin()) return $resp;

        $aktivnost->delete();

        return response()->json(['message' => 'Aktivnost deleted successfully']);
    }

    /**
 * @OA\Get(
 * path="/api/aktivnosti/search",
 * summary="Pretraga aktivnosti po nazivu ili opisu",
 * description="Omogućava pretragu svih dostupnih aktivnosti na osnovu unetog teksta.",
 * tags={"Aktivnosti"},
 * @OA\Parameter(
 * name="query",
 * in="query",
 * description="Tekst za pretragu",
 * required=true,
 * @OA\Schema(type="string")
 * ),
 * @OA\Response(
 * response=200,
 * description="Uspešna pretraga",
 * @OA\JsonContent(
 * type="array",
 * @OA\Items(
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="naziv", type="string", example="Obilazak Luvra"),
 * @OA\Property(property="opis", type="string", example="Detaljan obilazak muzeja sa vodičem.")
 * )
 * )
 * ),
 * @OA\Response(
 * response=404,
 * description="Nije pronađena nijedna aktivnost sa tim pojmom"
 * )
 * )
 */
    public function search(Request $request)
{
    $searchTerm = $request->query('query');

    if (!$searchTerm) {
        return response()->json(['count' => 0, 'data' => []]);
    }

    $aktivnosti = Aktivnost::whereHas('destinacija', function($q) use ($searchTerm) {
        $q->where('ime', 'LIKE', '%' . $searchTerm . '%');
    })->with('destinacija')->get();

    return response()->json([
        'count' => $aktivnosti->count(),
        'data' => AktivnostResource::collection($aktivnosti)
    ]);
}
}
