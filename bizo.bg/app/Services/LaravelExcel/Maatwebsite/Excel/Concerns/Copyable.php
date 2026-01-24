<?php

namespace App\Services\LaravelExcel\Maatwebsite\Excel\Concerns;

use Maatwebsite\Excel\Excel;

trait Copyable
{
    /**
     * Get a copyable version of export.
     */
    public function copy(): string
    {
        return $this->raw(Excel::CSV);
    }
}
