<?php

namespace App\Traits\Resource;

use Illuminate\Database\Eloquent\Collection;

trait TableResource
{
    public array $additionalDataFields = [];

    protected static array $defaultPerPageOptions = [
        ['value' => 10, 'label' => '10'],
        ['value' => 25, 'label' => '25'],
        ['value' => 50, 'label' => '50'],
        ['value' => 100, 'label' => '100'],
        ['value' => 200, 'label' => '200'],
    ];

    public function getDatasetForColumns(array $columns): array
    {
        return $this->resource->getCollection()->map(function ($resource) use ($columns) {
            $row = $this->resourceToColumnsMapper($columns, $resource);

            if ($this->additionalDataFields) {
                $row = array_merge($row, $this->resourceToColumnsMapper($this->additionalDataFields, $resource));
            }

            return $row;
        })->toArray();
    }

    public function getFiltersDataset(array $filters, Collection $sourceCollection): array
    {
        $preloaded = [];
        foreach ($filters as $filter) {
            $key = $filter['valuesKey'] ?? $filter['key'];
            $preloaded[$key] = $sourceCollection->pluck($key);
        }

        $mappedFilters = array_map(function ($filter) use ($preloaded) {

            $valuesKey = $filter['valuesKey'] ?? $filter['key'];
            $values = collect($preloaded[$valuesKey])->unique();

            if (isset($filter['hasMultipleValues']) && $filter['hasMultipleValues'] === true) {
                $valuesSeparator = $filter['valuesSeparator'] ?? ', ';
                $values = $values->map(function ($value) use ($valuesSeparator) {
                    return explode($valuesSeparator, $value);
                })->flatten()->unique();
            }

            if (isset($filter['permanentValues'])) {
                $values = $values->merge($filter['permanentValues'])->unique();
            }

            $filter['values'] = $values->map(function ($value) use ($filter) {
                return [
                    'value' => urlencode($value),
                    'name' => $value !== '' ? $value : '(BLANK)',
                    'key' => $filter['key'],
                ];
            })->toArray();

            usort($filter['values'], function ($a, $b) {
                return strcmp($a['name'], $b['name']);
            });

            return $filter;
        }, $filters);

        return array_filter($mappedFilters, function ($filter) {
            return count($filter['values']) > 1;
        });
    }

    public function getPagination(?array $perPageOptions = null): array
    {
        return [
            'total' => $this->resource->total(),
            'perPage' => $this->resource->perPage(),
            'perPageOptions' => $perPageOptions ? $perPageOptions : self::$defaultPerPageOptions,
            'currentPage' => $this->resource->currentPage(),
            'lastPage' => $this->resource->lastPage(),
            'previousPageUrl' => $this->resource->previousPageUrl(),
            'nextPageUrl' => $this->resource->nextPageUrl(),
            'firstItemNumber' => $this->resource->firstItem() ?? 0,
            'lastItemNumber' => $this->resource->lastItem() ?? 0,
        ];
    }

    protected function resourceToColumnsMapper(array $columns, object $resource): array
    {
        return array_map(function ($column) use ($resource) {
            return $resource->{$column['key']};
        }, $columns);
    }

    protected function getNoResultsFallback(int $resourceLength): string
    {
        $queryParams = request()->query();

        if (
            $resourceLength === 0 &&
            collect($queryParams)->keys()->contains(
                fn ($key) => $key === 'search' ||
                    $key === 'filter' ||
                    str_ends_with($key, '-search') ||
                    str_ends_with($key, '-filter')
            )
        ) {
            return 'no-results-fallback';
        }

        return '';
    }
}
