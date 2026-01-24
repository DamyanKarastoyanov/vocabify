<?php

return [
    'api_auth_username' => env('BROQEE_API_AUTH_EMAIL'),
    'api_auth_password' => env('BROQEE_API_AUTH_PASSWORD'),
    'api_auth_website' => env('BROQEE_API_AUTH_WEBSITE'),
    'api_auth_path' => env('BROQEE_API_AUTH_PATH'),
    'api_auth_proxy_key' => env('BROQEE_API_AUTH_PROXY_KEY'),
    'api_auth_should_append_proxy_key' => env('BROQEE_API_AUTH_SHOULD_APPEND_PROXY_KEY'),
    'api_auth_should_override_x_client_ip_header' => env('BROQEE_API_AUTH_SHOULD_OVERRIDE_X_CLIENT_IP_HEADER', false),
    'api_auth_x_client_ip_header_override' => env('BROQEE_API_AUTH_X_CLIENT_IP_HEADER_OVERRIDE'),
    'api_x_client_header' => env('BROQEE_API_X_CLIENT_HEADER'),
    'api_base_url' => env('BROQEE_API_BASE_URL'),
    'api_webhook_allowed_ips' => explode(',', env('BROQEE_API_WEBHOOK_ALLOWED_IPS', '')),
];
