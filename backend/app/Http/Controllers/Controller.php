<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * title="Planiranje Putovanja API",
 * version="1.0.0"
 * )
 * @OA\SecurityScheme(
 * securityScheme="sanctum",
 * type="http",
 * scheme="bearer",
 * bearerFormat="JWT"
 * )
 */
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * @OA\Get(
     * path="/",
     * summary="Provera servera",
     * @OA\Response(response="200", description="Server je online")
     * )
     */
    public function healthCheck() {
        return response()->json(['status' => 'ok']);
    }
}