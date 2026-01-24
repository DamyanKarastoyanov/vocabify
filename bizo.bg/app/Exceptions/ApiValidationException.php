<?php

namespace App\Exceptions;

class ApiValidationException extends ApiException
{
    /**
     * Get a formatted error response array suitable for a JSON response.
     *
     * @return array
     */
    public function getFormattedErrors(): array
    {
        $remoteResponseBody = $this->getResponseBody();

        $errors = $remoteResponseBody['errors'] ?? null;
        
        $allErrorMessages = $this->getAllErrorMessages();
        $mainMessage = !empty($allErrorMessages)
            ? $allErrorMessages
            : ($remoteResponseBody['title'] ?? 'The provided data was invalid according to the external service.');

        // If the 'errors' key is not present or not an array, provide a default error structure
        if (!is_array($errors) || empty($errors)) {
            $errors = [
                'general' => [$this->getMessage() ?: 'Validation failed.'] // Use exception message if specific errors are not found
            ];
        }

        return [
            'message' => $mainMessage,
            'errors' => $errors
        ];
    }

    /**
     * Get all validation error messages as a single concatenated string.
     *
     * @return string
     */
    private function getAllErrorMessages(): string
    {
        $remoteResponseBody = $this->getResponseBody();
        $errors = $remoteResponseBody['errors'] ?? [];
        
        $allMessages = [];
        
        // Handle different error formats
        if (is_array($errors)) {
            foreach ($errors as $field => $messages) {
                // Format 1: errors as object with field names as keys
                // {"errors": {"Customers[1].PIN": ["Невалиден ЕИК 9005150951"]}}
                if (is_string($field) && is_array($messages)) {
                    foreach ($messages as $message) {
                        $allMessages[] = $message;
                    }
                }
                // Format 2: errors as array of objects with code and description
                // {"errors": [{"code": "CUSTOMER-GROUP", "description": "Error message"}]}
                elseif (is_array($messages) && isset($messages['description'])) {
                    $allMessages[] = $messages['description'];
                }
                elseif (is_string($messages)) {
                    $allMessages[] = $messages;
                }
            }
        }
        
        return empty($allMessages) 
            ? ($this->getMessage() ?: 'Validation failed.') 
            : implode(' ', $allMessages);
    }
}
