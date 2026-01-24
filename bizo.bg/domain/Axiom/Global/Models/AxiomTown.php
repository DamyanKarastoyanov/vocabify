<?php

namespace Domain\Axiom\Global\Models;

use App\Support\ActivityLogHelper;
use App\Traits\Model\HasSelectOptionsTrait;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AxiomTown extends Model
{
    use LogsActivity, HasSelectOptionsTrait;

    protected $table = 'axiom_towns';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'postcode',
        'axiom_municipality_id',
        'axiom_id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return ActivityLogHelper::defaults();
    }

    public static function resolveLocation(int $townAxiomId): array
    {
        $town = self::firstWhere('axiom_id', $townAxiomId);
        if (!$town) {
            throw new \Exception("Town with Axiom ID {$townAxiomId} not found.");
        }

        $town_id = $town->id;
        $municipality = AxiomMunicipality::firstWhere('axiom_id', $town->axiom_municipality_id);
        $municipality_id = $municipality->id;
        $district = AxiomDistrict::firstWhere('axiom_id', $municipality->axiom_district_id);
        $district_id = $district->id;

        return compact('town_id', 'municipality_id', 'district_id');
    }
}
