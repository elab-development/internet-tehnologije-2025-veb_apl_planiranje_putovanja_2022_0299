<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Destinacija;
use App\Models\Mesto;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    public function importFromTripAdvisor(Request $request)
    {
        $trazeniPojam = $request->input('query', 'Tokio');
        $apiKey = 'be309d377emsh9bf23ee50a29ea7p149e47jsnbbeca8701abf';
        $apiHost = 'tripadvisor-scraper.p.rapidapi.com';

        $destinacija = Destinacija::updateOrCreate(
            ['ime' => $trazeniPojam],
            [
                'drzava' => 'Inostranstvo',
                'slug' => Str::slug($trazeniPojam . '-' . rand(100, 999)),
                'opis' => 'Destinacija automatski uvezena putem TripAdvisor Scraper-a.'
            ]
        );

        $resResponse = Http::withHeaders([
            'x-rapidapi-host' => $apiHost,
            'x-rapidapi-key' => $apiKey
        ])->get("https://$apiHost/restaurants/search", ['query' => $trazeniPojam]);

        $restorani = $resResponse->json()['data'] ?? $resResponse->json()['results'] ?? [];
        $uvezenoRestorana = 0;

        foreach ($restorani as $r) {
    $ime = $r['name'] ?? $r['title'] ?? null;
    
    if ($ime) {
        $lat = $r['latitude'] ?? $r['lat'] ?? $r['location']['latitude'] ?? null;
        $lng = $r['longitude'] ?? $r['lng'] ?? $r['location']['longitude'] ?? null;

        $ocena = $r['rating'] ?? $r['average_rating'] ?? 0;
        $recenzije = $r['reviews'] ?? $r['num_reviews'] ?? 0;

        $destinacija->mesta()->updateOrCreate(
            ['ime' => $ime],
            [
                'tip' => 'restoran',
                'adresa' => $r['address'] ?? $trazeniPojam,
                'slug' => Str::slug($ime . '-' . rand(100, 999)),
                'prosecna_ocena' => (float)$ocena,
                'broj_recenzija' => (int)$recenzije,
                'geografska_sirina' => $lat,
                'geografska_duzina' => $lng,
            ]
        );
        $uvezenoRestorana++;
    }
        }

        $hotelResponse = Http::withHeaders([
            'x-rapidapi-host' => $apiHost,
            'x-rapidapi-key' => $apiKey
        ])->get("https://$apiHost/hotels/search", ['query' => $trazeniPojam]);

        $hoteli = $hotelResponse->json()['data'] ?? $hotelResponse->json()['results'] ?? [];
        $uvezenoHotela = 0;

        foreach ($hoteli as $h) {
            $imeHotela = $h['title'] ?? $h['name'] ?? null;
            if ($imeHotela) {
                $destinacija->mesta()->updateOrCreate(
                    ['ime' => $imeHotela],
                    [
                        'tip' => 'hotel',
                        'adresa' => $h['secondaryText'] ?? $h['address'] ?? $trazeniPojam,
                        'slug' => Str::slug($imeHotela . '-' . rand(100, 999)),
                        'prosecna_ocena' => (float) ($h['rating'] ?? 0),
                        'broj_recenzija' => (int) ($h['reviews'] ?? 0),
                    ]
                );
                $uvezenoHotela++;
            }
        }

        return response()->json([
            'status' => 'success',
            'destinacija_id' => $destinacija->id,
            'poruka' => "Uspešno uvezeno za grad: $trazeniPojam",
            'statistika' => [
                'restorana' => $uvezenoRestorana,
                'hotela' => $uvezenoHotela
            ]
        ]);
    }
}