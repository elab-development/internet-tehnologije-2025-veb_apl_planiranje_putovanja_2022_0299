<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\Destinacija;
use App\Models\Aktivnost;

class ImportAktivnosti extends Controller
{
    public function importAktivnosti(Request $request)
    {
        $trazeniPojam = $request->input('query', 'Rome');

        $apiKey  = 'be309d377emsh9bf23ee50a29ea7p149e47jsnbbeca8701abf';
        $apiHost = 'tripadvisor-scraper.p.rapidapi.com';

        // 1) destinacija mora postojati
        $destinacija = Destinacija::where('ime', 'LIKE', '%' . $trazeniPojam . '%')->first();
        if (!$destinacija) {
            return response()->json([
                'error' => "Grad '$trazeniPojam' ne postoji u bazi."
            ], 404);
        }

        // 2) pozovi API
        $response = Http::withHeaders([
            'x-rapidapi-host' => $apiHost,
            'x-rapidapi-key'  => $apiKey,
        ])->get("https://$apiHost/attractions/search", [
            'query' => $trazeniPojam
        ]);

        if (!$response->successful()) {
            return response()->json([
                'error' => 'Greška pri pozivu API-ja',
                'status_code' => $response->status(),
                'body' => $response->body(),
            ], 500);
        }

        $res = $response->json();
        $stavke = $res['results'] ?? [];

        if (empty($stavke)) {
            return response()->json([
                'status' => 'empty',
                'poruka' => 'API rezultati su prazni.'
            ], 200);
        }

        // 3) importuj samo ATTRACTION
        $uvezeno = 0;

        foreach ($stavke as $stavka) {
            $naziv = $stavka['name'] ?? null;
            $tip   = $stavka['place_type'] ?? null;

            if (!$naziv || $tip !== 'ATTRACTION') {
                continue;
            }

            // 4) slika (rapidapi format često ima featured_image)
            $slika = null;

            if (!empty($stavka['featured_image'])) {
                $slika = $stavka['featured_image'];
            } elseif (!empty($stavka['image_url'])) {
                $slika = $stavka['image_url'];
            } elseif (!empty($stavka['photo']['images']['large']['url'])) {
                $slika = $stavka['photo']['images']['large']['url'];
            } elseif (!empty($stavka['photo']['url'])) {
                $slika = $stavka['photo']['url'];
            }

            // 5) ostalo
            $opis = $stavka['description']
                ?? ('Atrakcija u: ' . ($stavka['parent_location']['name'] ?? $destinacija->ime));

            $trajanje = $stavka['duration'] ?? '2-4 h';
            $cena = (float) rand(10, 50);

            // 6) upis
            Aktivnost::updateOrCreate(
                [
                    'naziv' => $naziv,
                    'destinacija_id' => $destinacija->id,
                ],
                [
                    'slug' => Str::slug($naziv . '-' . rand(100, 999)),
                    'cena' => $cena,
                    'trajanje' => $trajanje,
                    'opis' => $opis,
                    'slika' => $slika, // <-- BITNO: mora da postoji kolona u bazi
                ]
            );

            $uvezeno++;
        }

        return response()->json([
            'status' => 'success',
            'poruka' => "Uspešno uvezeno $uvezeno atrakcija za " . $destinacija->ime,
            // korisno dok testiraš:
            'debug_first_item' => $stavke[0] ?? null
        ]);
    }
}
