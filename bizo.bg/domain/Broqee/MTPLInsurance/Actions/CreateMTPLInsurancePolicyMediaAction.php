<?php

namespace Domain\Broqee\MTPLInsurance\Actions;

use Domain\Broqee\MTPLInsurance\Models\BroqeeMTPLInsurancePolicy;
use Illuminate\Support\Facades\Http;

class CreateMTPLInsurancePolicyMediaAction
{
    public function handle(BroqeeMTPLInsurancePolicy $policy, string $download_url): void
    {
        $response = Http::withOptions([
            'verify' => false,
        ])->get($download_url);

        $fileContents = $response->body();

        // Extract filename
        $path = parse_url($download_url, PHP_URL_PATH);
        $filename = urldecode(basename($path));
        $originalFileName = $filename ?: 'policy.pdf';

        $policy
            ->addMediaFromString($fileContents)
            ->usingFileName($originalFileName)
            ->toMediaCollection(BroqeeMTPLInsurancePolicy::MEDIA_COLLECTION);
    }
}
