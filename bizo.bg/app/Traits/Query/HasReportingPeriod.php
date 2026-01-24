<?php

namespace App\Traits\Query;

use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

trait HasReportingPeriod
{
    protected ?string $start_date;

    protected string $end_date;

    protected function initializeReportingPeriod(Request $request, array $settings = []): void
    {
        $dateStringFormat = $settings['dateStringFormat'] ?? 'Y-m';
        $now = Carbon::now();
        $defaultPeriod = $settings['defaultPeriod'] ?? 5;
        $defaultKey = $settings['key'] ?? '';
        $defaultPeriodPeriod = $settings['defaultPeriodPeriod'] ?? null;
        $period = $request->query('period' . $defaultKey, $defaultPeriodPeriod);

        if ($period) {
            if ($period === 'allTime') {
                $this->start_date = null;
                $this->end_date = $this->calculateEndDate($request->query('end_date'), $now, $dateStringFormat);
            } else {
                [$this->start_date, $this->end_date] = $this->calculateDatesFromPeriod($period, $now, $dateStringFormat, $defaultPeriod);
            }
        } else {
            $this->start_date = $this->calculateStartDate($request->query('start_date' . $defaultKey), $now, $defaultPeriod, $dateStringFormat);
            $this->end_date = $this->calculateEndDate($request->query('end_date' . $defaultKey), $now, $dateStringFormat);
        }
    }

    private function calculateStartDate(?string $queryStartDate, Carbon $now, int $defaultPeriod, string $format): string {
        $startDate = $queryStartDate ?
            Carbon::parse($queryStartDate) :
            $now->clone()->subMonthsNoOverflow($defaultPeriod)->startOfMonth();

        return $startDate->format($format);
    }

    private function calculateEndDate(?string $queryEndDate, Carbon $now, string $format): string
    {
        $endDate = $queryEndDate ?
            Carbon::parse($queryEndDate) :
            $now->clone()->endOfMonth();

        return $endDate->format($format);
    }

    private function calculateDatesFromPeriod(string $period, Carbon $now, string $format, int $defaultPeriod): array
    {
        $period = strtolower($period);

        $startDate = $now->copy();

        $endDate = $now->copy()->endOfMonth();

        if ($period === 'tm' || $period === 'thismonth') {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
        } elseif ($period === 'lm' || $period === 'lastmonth') {
            $startDate = $now->copy()->subMonthsNoOverflow(1)->startOfMonth();
            $endDate = $now->copy()->subMonthsNoOverflow(1)->endOfMonth();
        } elseif ($period === 'ytm') {
            $startDate = $now->copy()->startOfYear();
            $endDate = $now->copy()->endOfMonth();
        } else {

            $monthsToSubtract = [
                '3m' => 2,
                '6m' => 5,
                '12m' => 11,
            ];

            $months = $monthsToSubtract[$period] ?? $defaultPeriod;

            $startDate = $now->copy()->subMonthsNoOverflow($months)->startOfMonth();
        }

        return [$startDate->format($format), $endDate->format($format)];
    }
}
