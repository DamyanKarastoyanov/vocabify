/**
 * Internal dependencies - Icons
 */
import IconShield from "@/components/icons/shield";
import IconLogoLevIns from "@/components/icons/logo-lev-ins";
import IconLogoEvroIns from "@/components/icons/logo-evroins";
import IconLogoDZI from "@/components/icons/logo-dzi";
import IconLogoGroupama from "@/components/icons/logo-groupama";
import IconLogoOZK from "@/components/icons/logo-ozk";
import IconLogoUniqa from "@/components/icons/logo-uniqa";
import IconLogoBulstrad from "@/components/icons/logo-bulstrad";

const insurersData = {
    bulins: { name: "Булинс", icon: IconShield },
    bulstrad: { name: "Булстрад", icon: IconLogoBulstrad },
    dallbogg: { name: "Dall Bogg", icon: IconShield },
    dzi: { name: "ДЗИ", icon: IconLogoDZI },
    euroins: { name: "Евроинс", icon: IconLogoEvroIns },
    groupama: { name: "Groupama", icon: IconLogoGroupama },
    levins: { name: "Лев Инс", icon: IconLogoLevIns },
    ozk: { name: "ОЗК", icon: IconLogoOZK },
    uniqa: { name: "Uniqa", icon: IconLogoUniqa },
};

/**
 * Transform raw offers data to standardized array format
 * Only includes fields needed for UI display and API calls
 * @param {Object} rawOfferData - Raw data from API
 * @returns {Array} Transformed offers array
 */
export const transformOffersData = (rawOfferData) => {
    if (
        !rawOfferData ||
        typeof rawOfferData !== "object" ||
        Array.isArray(rawOfferData)
    ) {
        return [];
    }

    const entries = Object.entries(rawOfferData);
    if (entries.length === 0) {
        return [];
    }

    return entries
        .map(([insurerKey, offerData]) => {
            const insurer = insurersData[insurerKey] || {
                name: insurerKey,
                icon: IconShield,
            };

            // Parse and validate total price
            const totalPrice = parseFloat(offerData.total_bgn);

            // Filter out offers without valid prices
            if (!offerData.total_bgn || isNaN(totalPrice) || totalPrice <= 0) {
                return null;
            }

            return {
                // Database ID for internal tracking
                id: offerData.id || offerData.offer,

                // Broqee offer ID - required for API calls
                broqee_offer_id: offerData.offer,

                // Required for UI display
                insurer_key: insurerKey,
                insurer_name: insurer.name,
                insurer_icon: insurer.icon,
                total_price: totalPrice,
                currency: "BGN",

                // Required for installment breakdown display
                // Handle payments as array (new format) or object (legacy format)
                installments: Array.isArray(offerData.payments)
                    ? offerData.payments.map((payment) => ({
                          total_bgn: payment.total_bgn,
                          total_eur: parseFloat(payment.total_eur),
                      }))
                    : Object.values(offerData.payments || {}).map(
                          (payment) => ({
                              total_bgn: payment.total_bgn,
                              total_eur: parseFloat(payment.total_eur),
                          }),
                      ),
            };
        })
        .filter((offer) => offer !== null);
};

export default transformOffersData;

/*
bulins: {
   status: 1,
   offer: 8,
   total: "404.36",
   total_bgn: "404.36",
   total_eur: "206.75",
   payments: {
       1: {
           number: 1,
           total: "119.97",
           total_bgn: "119.97",
           total_eur: "61.34",
       },
       2: {
           number: 2,
           total: "94.80",
           total_bgn: "94.80",
           total_eur: "48.47",
       },
       3: {
           number: 3,
           total: "94.80",
           total_bgn: "94.80",
           total_eur: "48.47",
       },
       4: {
           number: 4,
           total: "94.80",
           total_bgn: "94.80",
           total_eur: "48.47",
       },
   },
},
*/
/*

    "uniqa": {
        "status": 1,
        "offer": 207,
        "total": "257.13",
        "total_bgn": "257.13",
        "total_eur": "131.47",
        "payments": [
            {
                "number": 1,
                "total": "257.13",
                "total_bgn": "257.13",
                "total_eur": "131.47"
            }
        ],
        "id": 17
    }
*/
