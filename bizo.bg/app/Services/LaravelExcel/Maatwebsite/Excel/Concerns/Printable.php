<?php

namespace App\Services\LaravelExcel\Maatwebsite\Excel\Concerns;

use Maatwebsite\Excel\Excel;

trait Printable
{
    /**
     * Get a printable version of export.
     */
    public function print(): string
    {
        return str_replace(
            '<body>',
            '<body onload="window.print()">',
            $this->raw(Excel::HTML)
        );
    }
}
