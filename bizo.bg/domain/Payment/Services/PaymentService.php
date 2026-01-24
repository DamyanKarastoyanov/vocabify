<?php

namespace Domain\Payment\Services;

use Domain\Payment\Models\CurrencyCode;
use Domain\Payment\Models\PaymentHistory;
use Illuminate\Support\Facades\Http;

class PaymentService
{
    private const PAYMENT_REGISTRATION_SUCCESS_CODE = 0;
    private const PAYMENT_ORDER_STATUS_SUCCESS_CODE = 2;

    // public function __construct(
    //     protected CreateUserAction $createUserAction
    // ) {
    //     //
    // }

    public function register(string $order_number, int $amount_cents, int|string $currency_code, string $return_url, int $user_id): array
    {
        $currency_code = CurrencyCode::getByCode($currency_code)->numeric_code ?? CurrencyCode::EUR_NUMERIC_CODE;

        $payload = [
            'orderNumber' => $order_number,
            'amount' => $amount_cents,
            'currency' => $currency_code,
            'returnUrl' => $return_url,
            'userName' => config('payment.api_auth_login'),
            'password' => config('payment.api_auth_password'),
            'language' => 'bg',
        ];

        //dd(config('payment.api_base_url') . '/rest/register.do', $payload);

        $response = Http::asForm()->retry(3, 100)->post(config('payment.api_base_url') . '/rest/register.do', $payload);

        PaymentHistory::create([
            'user_id' => $user_id,
            'order_number' => $order_number,
            'gateway_order_id' => $response->json('orderId', null),
            'amount' => $amount_cents,
            'currency' => $currency_code,
            'return_url' => $return_url,
            'registration_status_code' => $response->json('errorCode', null),
            'registration_error_message' => $response->json('errorMessage', null),
            'registration_api_response_json' => $response->json(),
        ]);

        if ($response->successful() && $response->json('errorCode', 0) === self::PAYMENT_REGISTRATION_SUCCESS_CODE) {
            return [
                'status' => 'success',
                'redirect_url' => $response->json('formUrl', ''),
                'order_id' => $response->json('orderId', ''),
            ];
        } else {
            return [
                'status' => 'error',
                'message' => $response->json('errorMessage', 'An error occurred while processing the payment.'),
            ];
        }
    }

    public function getOrderStatus(string $gateway_order_id): array
    {
        // dd(config('payment.api_base_url') . '/rest/getOrderStatusExtended.do', [
        //     'userName' => config('payment.api_auth_login'),
        //     'password' => config('payment.api_auth_password'),
        //     'orderId' => $gateway_order_id,
        // ]);

        $response = Http::asForm()->retry(3, 100)->post(config('payment.api_base_url') . '/rest/getOrderStatusExtended.do', [
            'userName' => config('payment.api_auth_login'),
            'password' => config('payment.api_auth_password'),
            'orderId' => $gateway_order_id,
            'language' => 'bg',
        ]);

        PaymentHistory::where('gateway_order_id', $gateway_order_id)->update([
            'order_status_code' => $response->json('orderStatus', null),
            'order_error_code' => $response->json('errorCode', null),
            'order_error_message' => $response->json('errorMessage', null),
            'order_api_response_json' => $response->json(),
        ]);

        //dd($response->json());
        /*
            0 - order was registered but not paid;
            1 - order was authorized only and wasn't captured yet (for two-phase payments);
            2 - order was authorized and captured;
            3 - authorization canceled;
            4 - transaction was refunded;
            5 - access control server of the issuing bank initiated authorization procedure;
            6 - authorization declined;
            7 - pending order payment;
            8 - intermediate completion for multiple partial completion.
        */
        if ($response->successful() && $response->json('orderStatus', 0) === self::PAYMENT_ORDER_STATUS_SUCCESS_CODE) {
            return [
                'status' => 'success',
                'data' => $response->json(),
            ];
        } else {
            $message = ($response->json('displayErrorMessage', null) ?? $response->json('errorMessage', null));
            return [
                'status' => 'error',
                'message' => $message ? 'Възникна проблем с плащането: ' . $message : 'Възникна грешка при обработката на плащането.',
            ];
        }
    }
}
