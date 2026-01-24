<?php

namespace App\Traits\Query;

use Exception;
use Illuminate\Database\Eloquent\Builder;

trait TypeFilterable
{
    protected string $type;

    protected function typeFilterQuery(Builder $query): Builder
    {
        if (! method_exists($this, 'addTypeFilteringToQuery')) {
            throw new Exception(sprintf(
                "Class %s must define method 'addTypeFilteringToQuery' to use TypeFilterable trait.",
                get_class($this)
            ));
        }

        $queryClone = clone $query;
        $query = $this->addTypeFilteringToQuery($query);

        if (! $this->request->query('type') && $this->type && $query->count() === 0) {
            // if there is a default value for type and the query is empty, we can fallback to the fallback type or no type filtering
            if (isset($this->fallbackType) && $this->fallbackType) {
                $this->type = $this->fallbackType;
                $query = $this->addTypeFilteringToQuery($queryClone);
            } else {
                $query = $queryClone;
            }
        }

        return $query;
    }
}
