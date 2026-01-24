<?php

namespace App\Traits\Query;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    protected string $filter;

    protected string $ancillaryFilter;

    protected string $filterKeyPrefix = '';

    protected function filterQuery(Builder $query, array $columns): Builder
    {
        $this->filter = $this->request->query($this->filterKeyPrefix . 'filter') ?? '';
        $this->ancillaryFilter = $this->request->query($this->filterKeyPrefix . 'ancillaryFilter') ?? '';
        $this->columns = $columns;

        if ($this->filter) {
            $query = $this->_applyFilterValue($query, $this->filter);
        }

        if ($this->ancillaryFilter) {
            $query = $this->_applyFilterValue($query, $this->ancillaryFilter, true);
        }

        return $query;
    }

    public function getActiveFilters(): array
    {
        $this->filter = $this->request->query('filter') ?? '';
        $this->ancillaryFilter = $this->request->query('ancillaryFilter') ?? '';

        return [
            'filter' => $this->filter ? $this->decodeFilterValue($this->filter) : [],
            'ancillaryFilter' => $this->ancillaryFilter ? $this->decodeFilterValue($this->ancillaryFilter) : [],
        ];
    }

    protected function decodeFilterValue(string $filterValue): array
    {
        $explodedFilters = explode(',', $filterValue);
        $decodedFilters = [];
        foreach ($explodedFilters as $filter) {
            $filterExploded = explode(':', $filter);
            if (count($filterExploded) < 2) {
                continue;
            }
            $column = $filterExploded[0];
            $value = urldecode($filterExploded[1]);
            $decodedFilters[$column] = explode('|', $value);
        }

        return $decodedFilters;
    }

    protected function _applyFilterValue(Builder $query, string $filterValue, bool $isAncillary = false): Builder
    {
        $explodedFilters = explode(',', $filterValue);
        $defaultPattern = $isAncillary ? '%s' : '%%%s%%';
        foreach ($explodedFilters as $filter) {
            $filterExploded = explode(':', $filter);
            if (count($filterExploded) < 2) {
                continue;
            }
            $column = $filterExploded[0];
            $value = urldecode($filterExploded[1]);
            $key = $this->getRelevantFilterKey($column);
            $pattern = $this->getRelevantFilterPattern($column);

            $pattern = $pattern ?: $defaultPattern;

            $values = explode('|', $value);

            $query->where(function ($query) use ($values, $key, $pattern) {
                foreach ($values as $value) {
                    if ($value === '') {
                        $query->orWhere($key, '=', $value)
                            ->orWhereNull($key);
                    } else {
                        $query->orWhere($key, 'like', sprintf($pattern, $value));
                    }
                }
            });
        }

        return $query;
    }

    protected function getRelevantFilterKey(string $column): string
    {
        $key = $column;
        if (isset($this->columns[$column]) && $this->columns[$column]['hasFilterControl']) {
            $key = $this->columns[$column]['key'];
        }

        return $key;
    }

    protected function getRelevantFilterPattern(string $column): string
    {
        $pattern = '';
        if (isset($this->columns[$column]) && isset($this->columns[$column]['filterPattern'])) {
            $pattern = $this->columns[$column]['filterPattern'];
        }

        return $pattern;
    }
}
