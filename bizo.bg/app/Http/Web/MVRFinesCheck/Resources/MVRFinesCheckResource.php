<?php

namespace App\Http\Web\MVRFinesCheck\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MVRFinesCheckResource extends JsonResource
{
    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        return $this->resource;
    }
}

