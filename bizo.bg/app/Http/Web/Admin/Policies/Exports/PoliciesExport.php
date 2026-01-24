<?php

namespace App\Http\Web\Admin\Policies\Exports;

use App\Http\Web\Admin\Policies\Data\PoliciesColumnsDefinition;
use App\Http\Web\Admin\Policies\Queries\PoliciesQuery;
use App\Services\LaravelExcel\BaseExport;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class PoliciesExport extends BaseExport
{
    /**
     * Constructor.
     */
    public function __construct(
        protected Request $request,
    ) {
        $this->request = $request;
        $this->defaultColumns = PoliciesColumnsDefinition::getColumns();
        $this->title = 'Policies | Bizo';
        $this->sheet_title = 'Policies';

        parent::__construct($request);
    }

    /**
     * Get the results' collection.
     */
    public function collection(): Collection
    {
        return (new PoliciesQuery($this->request))->get();
    }
}
