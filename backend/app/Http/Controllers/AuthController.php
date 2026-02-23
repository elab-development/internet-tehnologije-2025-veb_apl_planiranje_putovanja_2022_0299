<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
 * @OA\Post(
 * path="/api/register",
 * summary="Registracija novog korisnika",
 * tags={"Autentifikacija"},
 * @OA\RequestBody(
 * required=true,
 * @OA\JsonContent(
 * @OA\Property(property="name", type="string"),
 * @OA\Property(property="email", type="string"),
 * @OA\Property(property="password", type="string")
 * )
 * ),
 * @OA\Response(response="201", description="Korisnik uspešno kreiran")
 * )
 */

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ime' => 'required|string|max:255',
            'email' => 'required|string|max:255|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'ime' => $request->ime,
            'email' => $request->email,
            'role' => 'user' ,
            'password' => Hash::make($request->password)
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user, 
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
    /**
 * @OA\Post(
 * path="/api/login",
 * summary="Logovanje korisnika",
 * description="Korisnik šalje kredencijale da bi dobio Bearer token.",
 * tags={"Autentifikacija"},
 * @OA\RequestBody(
 * required=true,
 * @OA\JsonContent(
 * @OA\Property(property="email", type="string", example="admin@gmail.com"),
 * @OA\Property(property="password", type="string", example="password")
 * )
 * ),
 * @OA\Response(
 * response=200,
 * description="Uspešan login",
 * @OA\JsonContent(
 * @OA\Property(property="access_token", type="string"),
 * @OA\Property(property="token_type", type="string", example="Bearer")
 * )
 * ),
 * @OA\Response(response=401, description="Pogrešan email ili lozinka")
 * )
 */
    public function login(Request $request)
{
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Wrong credentials'], 401);
    }

    $user = User::where('email', $request['email'])->firstOrFail();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => $user->ime . ' logged in',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => [
            'ime' => $user->ime,
            'role' => $user->role,
            'email' => $user->email
        ]
    ]);
}

/**
 * @OA\Post(
 * path="/api/logout",
 * summary="Odjava korisnika",
 * description="Uništava trenutni pristupni token i odjavljuje korisnika sa sistema.",
 * tags={"Autentifikacija"},
 * security={{"sanctum":{}}},
 * @OA\Response(
 * response=200,
 * description="Uspešna odjava",
 * @OA\JsonContent(
 * @OA\Property(property="message", type="string", example="Logged out successfully")
 * )
 * ),
 * @OA\Response(
 * response=401,
 * description="Niste autorizovani (neispravan token)"
 * )
 * )
 */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return [
            'message' => 'You have successfully logged out.'
        ];
    }


/**
 * @OA\Get(
 * path="/api/users",
 * summary="Prikaz svih korisnika",
 * tags={"Autentifikacija"},
 * security={{"sanctum":{}}},
 * @OA\Response(response=200, description="Lista korisnika"),
 * @OA\Response(response=403, description="Samo admin može videti listu")
 * )
 */
public function index()
{
    if (!Auth::user() || !Auth::user()->isAdmin()) {
        return response()->json(['message' => 'Nemaš ovlašćenje za ovaj prikaz.'], 403);
    }

    $users = User::all();
    return response()->json($users);
}

/**
 * @OA\Delete(
 * path="/api/users/{id}",
 * summary="Brisanje korisnika",
 * tags={"Autentifikacija"},
 * security={{"sanctum":{}}},
 * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
 * @OA\Response(response=200, description="Korisnik obrisan")
 * )
 */
public function destroy($id)
{
    if (!Auth::user()->isAdmin()) {
        return response()->json(['message' => 'Nemaš ovlašćenje.'], 403);
    }

    $user = User::findOrFail($id);
    
    if ($user->id === Auth::id()) {
        return response()->json(['message' => 'Ne možeš obrisati svoj nalog.'], 400);
    }

    $user->delete();
    return response()->json(['message' => 'Korisnik uspešno obrisan.']);
}
}