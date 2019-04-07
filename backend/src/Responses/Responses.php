<?php

namespace App\Responses;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class Responses 
{
    public static function BadRequest($error)
    {
        return new JsonResponse($error, 400);
    }

    public static function PermisionDenied()
    {
        return new Response(json_encode(["message" => "Nie posiadasz uprawnień"],
            JSON_UNESCAPED_UNICODE), 401);
    }

    public static function Ok()
    {
        return new Response("", 200);
    }

    public static function NotFound()
    {
        return new Response(json_encode(["message" => "strony nie znaleziono"], 
            JSON_UNESCAPED_UNICODE), 404);
    }
}