<?php

use App\Http\Controllers\DestinacijaController;
use App\Http\Controllers\MestoController;
use App\Http\Controllers\RecenzijaController;
use App\Http\Controllers\AktivnostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchController;

use App\Http\Controllers\ImportController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/destinations', [DestinacijaController::class, 'index']);
Route::get('/destinations/{destination}', [DestinacijaController::class, 'show'] );


Route::get('/places', [MestoController::class, 'index']);
Route::get('/places/{place}/reviews', [RecenzijaController::class, 'index']);
Route::get('/places/{place}', [MestoController::class, 'show']);

Route::get('/search', [SearchController::class, 'search']);


Route::get('/aktivnosti', [AktivnostController::class, 'index']);
Route::get('/aktivnosti/{aktivnost}', [AktivnostController::class, 'show']);



Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    

        Route::post(
        'import/destinations',
        [ImportController::class, 'importFromTripAdvisor']
        );


        Route::resource('destinations', DestinacijaController::class)
                ->only(['store', 'update', 'destroy']);

        Route::resource('places', MestoController::class)
                ->only(['store', 'update', 'destroy']);

        Route::resource('reviews', RecenzijaController::class)
                ->only(['store', 'destroy']);

        Route::resource('aktivnosti', AktivnostController::class)
                ->only(['store', 'update', 'destroy']);

});