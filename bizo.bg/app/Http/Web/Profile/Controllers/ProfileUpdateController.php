<?php

namespace App\Http\Web\Profile\Controllers;

use Carbon\Carbon;
use Domain\Users\Actions\UpdateProfileAction;
use Domain\Users\Models\User;
use Domain\Users\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\Auth;

class ProfileUpdateController
{
    /**
     * Constructor.
     */
    public function __construct(
        protected UpdateProfileAction $updateProfileAction,
    ) {
        //
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateProfileRequest $request, User $user): array
    {
        if(!$user->id) {
            $user = Auth::user();
        }

        $data = $request->validated();

        // Map flat payload to profile + nested address structure
        $profileData = [
            'first_name' => $data['profile_first_name'] ?? null,
            'latin_full_name' => $data['profile_latin_full_name'] ?? null,
            'birth_date' => Carbon::parse($data['profile_birth_date']) ?? null,
            'personal_identification_number' => $data['profile_personal_identification_number'] ?? null,
            'phone' => $data['profile_phone'] ?? null,
            'driver_license' => $data['profile_driver_license'] ?? null,
            'address' => [
                'district_id' => $data['address_district'] ?? null,
                'municipality_id' => $data['address_municipality'] ?? null,
                'town_id' => $data['address_town'] ?? null,
                'postal_code' => $data['address_postcode'] ?? null,
                'address' => $data['address_address'] ?? null,
            ],
        ];

        $profileData['last_name'] = ($data['profile_personal_identification_number_type'] ?? null) == 4 ? null : ($data['profile_last_name'] ?? null);
        $profileData['personal_identification_number_type_id'] = !empty($data['profile_personal_identification_number']) ? ($data['profile_personal_identification_number_type'] ?? null) : null;

        if (empty(array_filter($profileData['address'], fn($v) => $v !== null))) {
            unset($profileData['address']);
        }

        $profile = $this->updateProfileAction->handle($user->profile, $profileData);

        return [
            'success' => isset($profile->id),
            'profile' => $profile->load('address'),
        ];
    }
}

/*


fetch("http://local.bizo.bg/profile/update", {
  headers: {
    "accept": "application/json",
    "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,ru;q=0.7",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  },
  referrer: "http://local.bizo.bg/home-insurance",
  referrerPolicy: "strict-origin-when-cross-origin",
  body: JSON.stringify({
      email: "vdimovv@gmail.com",
      profile_personal_identification_number_type: 1,
      profile_personal_identification_number: "8805305860",
      profile_first_name: "Пешо",
      profile_last_name: "Малкия",
      profile_latin_full_name: "Pesho Malkiq",
      profile_phone: '0883314542',
      address_district: 3,
      address_municipality: 3,
      address_town: 3,
      address_postcode: "3333",
      address_address: "УЛИЦАТА В СЯНКА"
  }),
  method: "POST",
  mode: "cors",
  credentials: "include"
});


*/


