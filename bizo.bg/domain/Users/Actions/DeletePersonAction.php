<?php

namespace Domain\Users\Actions;

use Domain\Users\Models\Person;

class DeletePersonAction
{
    public function handle(Person $person): void
    {
        $person->delete();
    }
}
