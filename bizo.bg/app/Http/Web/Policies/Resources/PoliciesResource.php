<?php

namespace App\Http\Web\Policies\Resources;

use App\Http\Web\Policies\Data\PoliciesColumnsDefinition;
use App\Traits\Resource\TableResource;
use Domain\Insurance\Models\PolicyStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PoliciesResource extends JsonResource
{
    use TableResource;

    /**
     * Resolve the resource to an array.
     */
    public function toArray(Request $request): array
    {
        $columns = PoliciesColumnsDefinition::getColumns();

        return [
            'policies' => $this->_getDatasetForColumns($columns),
            'policies_statuses' => $this->getPolicyStatusesWithBulgarianTranslations(),
            'columns' => $columns,
        ];
    }

    protected function _getDatasetForColumns(array $columns): array
    {
        return $this->resource->map(function ($resource) use ($columns) {
            $row = $this->resourceToColumnsMapper($columns, $resource);

            if ($this->additionalDataFields) {
                $row = array_merge($row, $this->resourceToColumnsMapper($this->additionalDataFields, $resource));
            }

            return $row;
        })->toArray();
    }

    /**
     * Get policy statuses with Bulgarian translations.
     */
    protected function getPolicyStatusesWithBulgarianTranslations(): array
    {
        $bulgarianTranslations = [
            'draft' => 'Чернова',
            'pending_customer_action' => 'Ти си на ход',
            'pending_insurer_confirmation' => 'Одобрението пътува',
            'awaiting_payment_confirmation' => 'Очаква плащане',
            'manual_review' => 'Колегата го гледа',
            'active' => 'Активна',
            'expired' => 'Изтекла',
            'cancelled' => 'Отменена',
            'declined' => 'Отказана',
        ];

        return PolicyStatus::all()
            ->filter(function ($status) {
                return $status->code !== 'draft';
            })
            ->map(function ($status) use ($bulgarianTranslations) {
                return [
                    'value' => $status->id,
                    'label' => $bulgarianTranslations[$status->code] ?? $status->name,
                ];
            })->toArray();
    }
}
