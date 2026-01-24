<?php

namespace App\Traits\Query;

use Illuminate\Database\Eloquent\Builder;

trait Sortable
{
    protected string $order;

    protected string $orderKeyPrefix = '';

    protected ?string $defaultTableOrder = null;

    public function sortQuery(Builder $query, array $columns): Builder
    {
        $this->columns = $columns;
        $defaultTableOrder = $this->defaultTableOrder ?? $this->getFirstVisibleColumnKey() . ',asc';
        $this->order = $this->request->query($this->orderKeyPrefix . 'order') ?? $defaultTableOrder;

        if ($this->order) {
            $explodedOrder = explode(',', $this->order);
            $column = $explodedOrder[0];
            $direction = $explodedOrder[1] ?? 'asc';

            if ($this->columns[$column] && $this->columns[$column]['hasSortControl']) {
                $query->orderBy($this->getRelevantOrderKey($column), $direction);
            }
        }

        return $query;
    }

    protected function getRelevantOrderKey(string $column): string
    {
        $key = $column;
        if (isset($this->columns[$column]) && $this->columns[$column]['hasSortControl']) {
            if (isset($this->columns[$column]['key'])) {
                $key = $this->columns[$column]['key'];
            }

            if (isset($this->columns[$column]['orderKey'])) {
                $key = $this->columns[$column]['orderKey'];
            }
        }

        return $key;
    }

    private function getFirstVisibleColumnKey()
    {
        foreach ($this->columns as $column) {
            if ($column['isVisible'] === true) {
                return $column['key'];
            }
        }

        return null;
    }
}
