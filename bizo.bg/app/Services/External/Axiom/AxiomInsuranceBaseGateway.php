<?php

namespace App\Services\External\Axiom;

use App\Exceptions\ApiLogicalException;
use Domain\Axiom\Global\Models\AxiomAgent;
use Illuminate\Support\Facades\Log;

abstract class AxiomInsuranceBaseGateway
{
    abstract protected function getClientService();
    abstract protected function getInsuranceTypeId(): int;
    abstract protected function getLogPrefix(): string;

    protected function getOfferIdByRequestId(string $requestId): string
    {
        $maxTries = 10;
        $try = 0;
        $found = false;
        $result = '';

        while ($try < $maxTries && !$found) {
            usleep(500000); // 500ms

            $offers = $this->getClientService()->getOffers([
                'PageSize' => 50,
                'AgentId' => AxiomAgent::DEFAULT_AGENT_ID,
                'InsuranceTypeId' => $this->getInsuranceTypeId(),
            ]);

            Log::info("{$this->getLogPrefix()} Offers Try #$try");

            if (!empty($offers['offers'])) {
                foreach ($offers['offers'] as $offer) {
                    if ($offer['requestId'] === $requestId) {
                        $result = $offer['id'];
                        $found = true;
                        break;
                    }
                }
            }

            $try++;
        }

        if (!$found) {
            throw new ApiLogicalException(
                "{$this->getLogPrefix()} Offer was created but not found on Axiom API after maximum retries.",
                404,
                [],
                [],
                '/offers/',
            );
        }

        return $result;
    }

    protected function getPolicyIdByAxiomOfferId(string $axiomOfferId): string
    {
        $maxTries = 10;
        $try = 0;
        $found = false;
        $result = '';

        while ($try < $maxTries && !$found) {
            usleep(500000); // Wait 500ms

            $policies = $this->getClientService()->getPolicies([
                'PageSize' => 50,
                'AgentId' => AxiomAgent::DEFAULT_AGENT_ID,
                'InsuranceTypeId' => $this->getInsuranceTypeId(),
            ]);

            Log::info("{$this->getLogPrefix()} Policies Try #$try");

            if (!empty($policies['policies'])) {
                foreach ($policies['policies'] as $policy) {
                    Log::info('Checking policy', [
                        'id' => $policy['id'],
                        'axiomOfferId' => $policy['axiomOfferId'],
                    ]);
                    if ($policy['axiomOfferId'] == $axiomOfferId) {
                        $result = $policy['id'];
                        $found = true;
                        break;
                    }
                }
            }

            $try++;
        }

        if (!$found) {
            throw new ApiLogicalException(
                'Policy was created but not found on Axiom API after maximum retries.',
                404,
                [],
                [],
                '/policies/'
            );
        }

        return $result;
    }
}
