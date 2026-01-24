<?php

namespace App\Http\Web\Dashboard\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        return $this->resource;
    }
} 