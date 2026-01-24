/**
 * External dependencies
 */
import moment from 'moment';

export const roundToNearest30Minutes = (date) => {
    return moment(date)
        .startOf('minute')
        .subtract(moment(date).minute() % 30, 'minutes')
        .toDate();
};
