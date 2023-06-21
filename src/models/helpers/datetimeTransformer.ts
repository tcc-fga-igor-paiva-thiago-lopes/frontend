import { formatISO, parseISO } from '@/utils/date';

export const datetimeTransformer = {
    to(value: Date | string | null | undefined) {
        if (value === null || value === undefined) return null;

        if (value instanceof Date) return formatISO(value);

        return formatISO(new Date(value));
    },
    from(value: Date | string | null | undefined) {
        if (value === null || value === undefined) return null;

        if (value instanceof Date) return value;

        return parseISO(value);
    },
};
