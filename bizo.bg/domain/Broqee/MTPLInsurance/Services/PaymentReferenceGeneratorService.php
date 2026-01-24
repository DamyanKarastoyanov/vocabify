<?php

namespace Domain\Broqee\MTPLInsurance\Services;

use Domain\Insurance\Models\Policy;

class PaymentReferenceGeneratorService
{
    public function generate(Policy $policy): string
    {
        $policyPart = strtoupper(base_convert($policy->id, 10, 36));
        $userPart   = strtoupper(base_convert($policy->user_id, 10, 36));

        $baseRef = sprintf('MTPL-P%s-U%s', $policyPart, $userPart);

        $checksum = crc32($baseRef) % 97;

        return sprintf('%s-C%d', $baseRef, $checksum);
    }
}
