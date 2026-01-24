<?php

namespace App\Http\Web\Admin\Payments\Controllers;

use App\Http\Web\Admin\Payments\Exports\PaymentsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Excel;

class PaymentsExportController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        \Debugbar::disable();
        $output = $request->input('output');
        $export = new PaymentsExport($request);

        switch ($output) {
            case 'print':
                return $export->print();
            case 'copy':
                return $export->copy();
            default:
                return $export->download('Payments Bizo ' . Carbon::now() . '.xlsx', Excel::XLSX);
        }
    }
}
