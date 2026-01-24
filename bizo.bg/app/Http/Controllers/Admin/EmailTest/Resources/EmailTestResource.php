<?php

namespace App\Http\Controllers\Admin\EmailTest\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailTestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource;
    }
}

