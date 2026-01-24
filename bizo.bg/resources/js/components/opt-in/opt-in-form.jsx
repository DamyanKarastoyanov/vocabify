/**
 * External dependencies
 */
import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";

/**
 * Internal dependencies
 */
import Box from "@/components/box/box";
import useEnableOptInMutation from "@/components/opt-in/data/use-enable-opt-in-mutation";
import OptInSubscribeForm from "@/components/opt-in/components/opt-in-subscribe-form";
import OptInSubscribeSuccess from "@/components/opt-in/components/opt-in-subscribe-success";

const SERVICE_REGISTRATION_EXTRACTORS = {
    "mtpl-check": (results) => results?.data?.registrationNumber ?? null,
    "vehicle-inspection": (results) =>
        results?.data?.inspectionData?.registrationNumber ??
        results?.data?.registration_number ??
        null,
    "vignette-check": (results) =>
        results?.data?.data?.apiResponse?.vignette?.licensePlateNumber ??
        results?.data?.data?.plateNumber ??
        results?.data?.plateNumber ??
        null,
    "mvr-fines-check": (results) => {
        const obligations = results?.data?.data?.obligations;
        if (Array.isArray(obligations) && obligations.length > 0) {
            return obligations[0]?.vehicleNumber ?? null;
        }

        return results?.data?.data?.vehicleNumber ?? null;
    },
};

const extractRegistrationNumber = (serviceType, results) => {
    const extractor = SERVICE_REGISTRATION_EXTRACTORS[serviceType];
    if (!extractor) return "";

    const registrationNumber = extractor(results);
    if (typeof registrationNumber !== "string") return "";

    return registrationNumber.trim();
};

const OptInForm = (props) => {
    const { results, serviceType } = props;
    const {
        auth: { user },
    } = usePage().props;

    const registrationNumber = useMemo(
        () => extractRegistrationNumber(serviceType, results),
        [results, serviceType],
    );
    const [isSubscribed, setIsSubscribed] = useState(null);
    const { mutate: enableOptIn } = useEnableOptInMutation();

    const onSubmit = (data) => {
        enableOptIn(
            {
                ...data,
                reg_number: registrationNumber || "",
                serviceType: serviceType,
                results: results,
            },
            {
                onSuccess: () => {
                    setIsSubscribed(true);
                },
                onError: () => {
                    setIsSubscribed(false);
                },
            },
        );
    };

    if (user?.opt_in) {
        return <></>;
    }

    return (
        <Box className="bz-opt-in-form-surface">
            {isSubscribed ? (
                <OptInSubscribeSuccess
                    vehicleRegistration={registrationNumber}
                />
            ) : (
                <OptInSubscribeForm onSubmit={onSubmit} />
            )}
        </Box>
    );
};

export default OptInForm;

/*  mtpl-check
    {
        "data": {
            "details": [
                {
                    "endDate": "17.10.2026г.\n                    23:59:59ч.",
                    "insurer": "ДЗИ-Общо застраховане АД",
                    "startDate": "18.10.2025г.\n                    00:00:00ч."
                }
            ],
            "message": "Към 10.11.2025г. 09:46ч. превозно средство с регистрационен номер  B1987BM има валидна задължителна застраховка \"Гражданска отговорност\" на автомобилистите",
            "success": true,
            "timestamp": "2025-11-10T07:45:50.443Z",
            "executionTime": 4097,
            "hasValidInsurance": true,
            "registrationNumber": "B1987BM"
        },
        "success": true,
        "cached": true
    }
/*

/* vehicle-inspection
    {
        "data": {
            "found": true,
            "inspectionData": {
                "status": "valid",
                "isValid": true,
                "isPeriodic": true,
                "ecoCategory": 3,
                "nextInspectionDate": "27.06.2026",
                "registrationNumber": "B1987BM",
                "identificationNumber": "*************1494"
            },
            "registration_number": "B1987BM"
        },
        "success": true,
        "cached": true
    }
*/

/* vignette-check
{
    "data": {
        "data": {
            "status": "active",
            "country": "BG",
            "apiResponse": {
                "ok": true,
                "status": {
                    "code": 200,
                    "message": "public.ui.ok"
                },
                "vignette": {
                    "price": 87,
                    "exempt": false,
                    "status": "Активна",
                    "country": "BG",
                    "currency": "BGN",
                    "issueDate": "2025-03-19T06:18:33",
                    "whitelist": false,
                    "vehicleType": "Превозно средство <= 3,5 тона",
                    "vehicleClass": "Превозно средство <= 3,5 тона",
                    "statusBoolean": true,
                    "emissionsClass": "Клас на емисиите Евро 0, Евро 1, Евро 2",
                    "validityDateTo": "2026-03-18T23:59:59",
                    "vignetteNumber": "25031945034474",
                    "vehicleTypeCode": "car",
                    "validityDateFrom": "2025-03-19T06:18:33",
                    "vehicleClassCode": "car",
                    "issueDateFormated": "19.03.2025 06:18:33",
                    "emissionsClassCode": "eur0",
                    "licensePlateNumber": "EA6373AB",
                    "validityDateToFormated": "18.03.2026 23:59:59",
                    "validityDateFromFormated": "19.03.2025 06:18:33"
                }
            },
            "plateNumber": "EA6373AB",
            "vignetteInfo": {
                "price": 87,
                "status": "Активна",
                "validTo": "18.03.2026 23:59:59",
                "currency": "BGN",
                "isExempt": false,
                "issueDate": "19.03.2025 06:18:33",
                "validFrom": "19.03.2025 06:18:33",
                "validToISO": "2026-03-18T23:59:59",
                "vehicleType": "Превозно средство <= 3,5 тона",
                "issueDateISO": "2025-03-19T06:18:33",
                "validFromISO": "2025-03-19T06:18:33",
                "vehicleClass": "Превозно средство <= 3,5 тона",
                "isWhitelisted": false,
                "emissionsClass": "Клас на емисиите Евро 0, Евро 1, Евро 2",
                "vignetteNumber": "25031945034474"
            },
            "hasValidVignette": true
        },
        "country": "BG",
        "success": true,
        "timestamp": "2025-11-10T08:09:08.982Z",
        "plateNumber": "EA6373AB",
        "executionTime": 306
    },
    "success": true,
    "cached": true
}
*/

/* mvr-fines-check
    {
        "success": true,
        "egn": "8704107907",
        "drivingLicenceNumber": "283896268",
        "data": {
            "hasObligations": true,
            "obligations": [
                {
                    "documentNumber": "25-0851-000640",
                    "documentType": "PENAL_DECREE",
                    "issueDate": "2025-05-14",
                    "isServed": true,
                    "vehicleNumber": "ТХ7642АТ",
                    "breachDate": "2025-04-24",
                    "breachOfOrder": "чл. 137А, ал. 1, от ЗДвП; ",
                    "amount": 50,
                    "discountAmount": 0,
                    "amountToPay": 50,
                    "currency": "BGN",
                    "amountEUR": 25.56,
                    "bankName": "\"ОББ\" АД",
                    "iban": "BG22UBBS88883122944101",
                    "bic": "UBBSBGSF",
                    "paymentReason": "НП 25-0851-000640 14.05.2025",
                    "expirationDate": "2025-11-11T23:59:59",
                    "obligationDate": "2025-11-11T00:00:00"
                }
            ],
            "totals": {
                "amountBGN": 50,
                "amountEUR": 25.56
            }
        },
        "timestamp": "2025-11-11T09:08:56.538Z",
        "executionTime": 14017
    }
*/
