<?php

namespace App\Traits\Query;

use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    protected string $search;

    protected string $searchKeyPrefix = '';

    protected function searchQuery(Builder $query, array $columns): Builder
    {
        $this->search = $this->request->query($this->searchKeyPrefix . 'search') ?? '';
        $this->columns = $columns;
        $currentlyVisibleColumns = $this->request->query($this->searchKeyPrefix . 'columns') ?? [];
        if (! is_array($currentlyVisibleColumns)) {
            $currentlyVisibleColumns = explode(',', $currentlyVisibleColumns);
        }

        if ($this->search) {
            $value = $this->search;

            $query->where(function ($query) use ($value, $currentlyVisibleColumns) {
                foreach ($this->columns as $key => $column) {
                    if ($column['isSearchable']) {
                        if (! empty($currentlyVisibleColumns) && ! in_array($key, $currentlyVisibleColumns)) {
                            continue;
                        }
                        $query->orWhere($column['key'], 'like', "%{$value}%");
                    }
                }
            });
        }

        return $query;
    }
}
