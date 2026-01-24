<?php

namespace Domain\Vehicles\Enums;

enum VehicleCreationSource: string
{
    case MTPL_INSURANCE = 'mtpl-insurance';
    case MTPL_CHECK = 'mtpl-check';
    case INSPECTION = 'inspection';
    case VIGNETTE = 'vignette';
    case MANUAL = 'manual'; // Vehicle Interface form
    case OPT_IN = 'opt_in';
    case UNKNOWN = 'unknown';
}

