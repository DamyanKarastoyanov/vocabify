<?php

namespace App\Http\Web\Admin\Policies\Controllers;

use App\Http\Web\Admin\Policies\Exports\PoliciesExport;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Excel;

class PoliciesExportController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        \Debugbar::disable();
        $output = $request->input('output');
        $export = new PoliciesExport($request);

        switch ($output) {
            case 'print':
                return $export->print();
            case 'copy':
                return $export->copy();
            default:
                return $export->download('Policies Bizo ' . Carbon::now() . '.xlsx', Excel::XLSX);
        }
    }
}
