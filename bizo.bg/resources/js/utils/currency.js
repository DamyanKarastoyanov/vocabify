import { formatNumber } from "@/utils/formatting";

export const EUR_TO_BGN_RATIO = 1.95583;

export function convertBGNToEUR(amount) {
    return formatNumber(amount / EUR_TO_BGN_RATIO, ",", 2);
}
