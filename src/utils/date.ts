import { format } from 'date-fns';

export * from 'date-fns';

const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

export const formatDate = (date: Date, formatString = DEFAULT_DATE_FORMAT) => {
    return format(date, formatString);
};

export const isDateInCurrentYear = (date: Date) =>
    date.getFullYear() === new Date().getFullYear();

export const formatDateDynamicYear = (date: Date) => {
    return formatDate(
        date,
        isDateInCurrentYear(date) ? 'dd/MM' : DEFAULT_DATE_FORMAT
    );
};
