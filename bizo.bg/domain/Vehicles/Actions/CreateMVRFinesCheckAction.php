<?php

namespace Domain\Vehicles\Actions;

use Domain\Vehicles\Models\MVRFinesCheck;

class CreateMVRFinesCheckAction
{
    public function handle(array $checkData, array $obligationsData = []): MVRFinesCheck
    {
        $check = MVRFinesCheck::updateOrCreate(
            [
                'egn' => $checkData['egn'],
                'driving_licence_number' => $checkData['driving_licence_number'],
            ],
            $checkData
        );

        $check->obligations()->delete();

        foreach ($obligationsData as $obligationData) {
            $check->obligations()->create($obligationData);
        }

        return $check->load('obligations');
    }
}

