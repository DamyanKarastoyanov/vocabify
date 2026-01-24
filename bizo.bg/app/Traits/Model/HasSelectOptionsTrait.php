<?php

namespace App\Traits\Model;

use Illuminate\Database\Eloquent\Builder;

trait HasSelectOptionsTrait
{
    public static function selectOptions(Builder|null $query = null, string $label = 'name', string $value = 'id'): array
    {
        $query = $query ?? static::query()->select([$value, $label])->orderBy($label, 'asc');

        return $query
            ->get()
            ->map(fn ($item) => [
                'value' => $item->{$value},
                'label' => $item->{$label},
            ])
            ->toArray();
    }
}
