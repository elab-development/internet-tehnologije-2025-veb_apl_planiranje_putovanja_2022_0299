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
        $trazeniPojam = $request->input('query', 'New York');
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
        
    $opisIzApi = $r['description'] ?? "Uživajte u boravku u objektu $ime.";
        $slikaRestoran = null;
        $ocenaRestorana = $r['rating'] ?? 0;
                $recenzijeRestorana = $r['reviews'] ?? 0;
       
        if (isset($r['featured_image'])) {
            $slikaRestoran = $r['featured_image'];
        } elseif (isset($r['image_url'])) {
            $slikaRestoran = $r['image_url'];
        } elseif (isset($r['photo']['images']['large']['url'])) {
            $slikaRestoran = $r['photo']['images']['large']['url'];
        } elseif (isset($r['photo']['url'])) {
            $slikaRestoran = $r['photo']['url'];
        } elseif (isset($r['heroImage'])) {
            $slikaRestoran = $r['heroImage'];
        }       
        $destinacija->mesta()->updateOrCreate(
            ['ime' => $ime],
            [
                'tip' => 'restoran',
                'adresa' => $r['address'] ?? $trazeniPojam,
                'slug' => Str::slug($ime . '-' . rand(100, 999)),
                'slika' => $slikaRestoran,
                'prosecna_ocena' =>  rand(25, 50)/10,
                'broj_recenzija' =>  rand(10, 5000),
                'opis'=> $opisIzApi ,
              
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
            $imeHotela = $h['name'] ?? $h['title'] ?? null;
            
            if ($imeHotela) {
                  $slikaHotel = $h['featured_image'] ?? null;
        $opisRestoran = $h['description'] ?? "Izvanredna ponuda u hotelu $imeHotela.";
      $ocenaHotela = $h['rating'] ?? 0;
                $recenzijeHotela = $h['reviews'] ?? 0;
                $destinacija->mesta()->updateOrCreate(
                    ['ime' => $imeHotela],
                    [
                        'tip' => 'hotel',
                        'adresa' => $h['secondaryText'] ?? $h['address'] ?? $trazeniPojam,
                        'slug' => Str::slug($imeHotela . '-' . rand(100, 999)),
                        'slika' => $slikaHotel,
                        'prosecna_ocena' => rand(25, 50)/10,
                        'broj_recenzija' =>  rand(10, 5000),
                        'opis'=> $opisRestoran ,
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