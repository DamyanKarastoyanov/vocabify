<?php

namespace App\Services\External\Axiom;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AxiomApiTokenService
{
    protected $authUrl;
    protected $username;
    protected $password;
    protected $token;
    protected $timeToLive;

    public function __construct()
    {
        $this->authUrl = config('axiom.api_base_url') . config('axiom.api_auth_path');
        $this->username = config('axiom.api_auth_username');
        $this->password = config('axiom.api_auth_password');
        $this->token = config('axiom.api_token');
        $this->timeToLive = config('axiom.api_auth_ttl', 55);
    }

    public function getToken()
    {
        return Cache::remember('axiom_api_bearer_token', $this->timeToLive, function () {
            $response = Http::post($this->authUrl, [
                'username' => $this->username,
                'password' => $this->password,
                'token' => $this->token,
            ]);

            if ($response->failed()) {
                throw new \Exception("Failed to retrieve bearer token");
            }

            return $response->json()['token'];
        });
    }

    public function forgetToken()
    {
        Cache::forget('axiom_api_bearer_token');
    }
}
