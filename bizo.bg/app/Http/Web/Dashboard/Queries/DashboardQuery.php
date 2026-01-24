<?php

namespace App\Http\Web\Dashboard\Queries;

use App\Http\Web\Installments\Queries\InstallmentsQuery;
use App\Http\Web\Policies\Queries\PoliciesQuery;
use Illuminate\Http\Request;

class DashboardQuery
{
    public function __construct(protected Request $request)
    {
        //
    }

    public function get(): array
    {
        return [
            'policies' => $this->getLatestPolicies(),
            'installments' => $this->getLatestInstallments(),
        ];
    }

    /**
     * Get the latest 5 policies.
     */
    protected function getLatestPolicies()
    {
        $policiesQuery = new PoliciesQuery($this->request);
        return $policiesQuery->get(true)->sortByDesc('id')->take(5)->values();
    }

    /**
     * Get the latest 5 pending installments.
     */
    protected function getLatestInstallments()
    {
        $installmentsQuery = new InstallmentsQuery($this->request, 0, InstallmentsQuery::TYPE_PENDING);
        return $installmentsQuery->get(true)->sortByDesc('id')->take(5)->values();
    }
}
