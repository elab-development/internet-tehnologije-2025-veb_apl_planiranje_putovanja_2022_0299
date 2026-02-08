<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return [
            'message' => 'You have successfully logged out.'
        ];
    }



public function index()
{
    if (!Auth::user() || !Auth::user()->isAdmin()) {
        return response()->json(['message' => 'Nemaš ovlašćenje za ovaj prikaz.'], 403);
    }

    $users = User::all();
    return response()->json($users);
}


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