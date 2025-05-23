<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof TokenExpiredException) {
            return response()->json(['error' => 'Token has expired'], 401);
        } elseif ($exception instanceof TokenInvalidException) {
            return response()->json(['error' => 'Token is invalid'], 401);
        } elseif ($exception instanceof JWTException) {
            return response()->json(['error' => 'Token error'], 401);
        }

        return parent::render($request, $exception);
    }
}