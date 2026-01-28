<?php


use App\Http\Controllers\DestinacijaController;
use App\Http\Controllers\MestoController;
use App\Http\Controllers\RecenzijaController;
use App\Http\Controllers\AktivnostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

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

Route::get('/activities', [AktivnostController::class, 'index']);
Route::get('/activities/{activity}', [AktivnostController::class, 'show']);



Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    


        Route::resource('destinations', DestinacijaController::class)
                ->only(['store', 'update', 'destroy']);

        Route::resource('places', MestoController::class)
                ->only(['store', 'update', 'destroy']);

        Route::resource('reviews', RecenzijaController::class)
                ->only(['store', 'destroy']);

        Route::resource('activities', AktivnostController::class)
                ->only(['store', 'update', 'destroy']);

});