<?php

namespace App\Traits\Query;

use Illuminate\Http\Request;

trait Pageable
{
    public function setPerPage(Request $request, int $defaultPerPage = 10): void
    {
        $this->perPage = $request->has('perPage')
            ? (int) $request->query('perPage')
            : $defaultPerPage;
    }
}
