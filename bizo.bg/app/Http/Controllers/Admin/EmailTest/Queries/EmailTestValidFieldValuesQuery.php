<?php

namespace App\Http\Controllers\Admin\EmailTest\Queries;

use Illuminate\Http\Request;

class EmailTestValidFieldValuesQuery
{
    public function __construct(protected Request $request)
    {
        //
    }

    public function get(): array
    {
        return [
            'email' => [],
        ];
    }
}

