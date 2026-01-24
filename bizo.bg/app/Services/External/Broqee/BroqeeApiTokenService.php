<?php

namespace App\Services\External\Broqee;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BroqeeApiTokenService
{
    protected $authUrl;
    protected $username;
    protected $password;
    protected $website;
    protected $timeToLive;

    public function __construct()
    {
        $this->authUrl = config('broqee.api_base_url') . config('broqee.api_auth_path');
        $this->username = config('broqee.api_auth_username');
        $this->password = config('broqee.api_auth_password');
        $this->website = config('broqee.api_auth_website');
        $this->timeToLive = config('broqee.api_auth_ttl', 55);
    }

    public function getToken()
    {
        return Cache::remember('broqee_api_bearer_token', $this->timeToLive, function () {
            $shouldAppendProxyKey = config('broqee.api_auth_should_append_proxy_key', false);
            $headers = [
                'X-Client' => config('broqee.api_x_client_header'),
            ];
            if($shouldAppendProxyKey) {
                $headers['X-MTPL-Proxy-Key'] = config('broqee.api_auth_proxy_key');
            }

            $response = Http::withHeaders($headers)->post($this->authUrl, [
                'email' => $this->username,
                'password' => $this->password,
                'website' => $this->website,
            ]);

            //dd($response, $response->json());

            if ($response->failed()) {
                $responseBody = $response->body();
                $responseStatus = $response->status();

                Log::info("Failed to retrieve bearer token from Broqee API. Response: " . $responseBody);
                Log::info("Response status: " . $responseStatus);
                Log::info("Response JSON: " . json_encode($response));
                throw new \Exception("Failed to retrieve bearer token");
            }

            return $response->json()['data']['token'];
        });
    }

    public function forgetToken()
    {
        Cache::forget('axiom_api_bearer_token');
    }
}
