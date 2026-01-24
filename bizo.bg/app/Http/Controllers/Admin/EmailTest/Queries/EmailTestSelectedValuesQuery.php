<?php

namespace App\Http\Controllers\Admin\EmailTest\Queries;

use Illuminate\Http\Request;

class EmailTestSelectedValuesQuery
{
    public function __construct(protected Request $request)
    {
        //
    }

    public function get(): array
    {
        return [
            'email' => $this->request->input('email', ''),
        ];
    }
}

