<?php

namespace App\Http\Web\Admin\Payments\Exports;

use App\Http\Web\Admin\Payments\Data\PaymentsColumnsDefinition;
use App\Http\Web\Admin\Payments\Queries\PaymentsQuery;
use App\Services\LaravelExcel\BaseExport;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class PaymentsExport extends BaseExport
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->request = $request;
        $this->defaultColumns = PaymentsColumnsDefinition::getColumns();
        $this->title = 'Payments | Bizo';
        $this->sheet_title = 'Payments';

        parent::__construct($request);
    }

    /**
     * Get the results' collection.
     */
    public function collection(): Collection
    {
        return (new PaymentsQuery($this->request))->get();
    }
}
