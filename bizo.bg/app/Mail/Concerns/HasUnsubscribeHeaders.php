<?php

namespace App\Mail\Concerns;

trait HasUnsubscribeHeaders
{
    /**
     * Add unsubscribe headers to the email.
     *
     * @param string $unsubscribeUrl
     * @return $this
     */
    protected function addUnsubscribeHeaders(string $unsubscribeUrl): self
    {
        return $this->withSymfonyMessage(function ($message) use ($unsubscribeUrl) {
            $headers = $message->getHeaders();
            $headers->addTextHeader('List-Unsubscribe', "<{$unsubscribeUrl}>");
            $headers->addTextHeader('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');
        });
    }
}
