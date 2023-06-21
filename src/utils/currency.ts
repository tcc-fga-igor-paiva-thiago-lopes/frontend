const DEFAULT_OPTIONS = {
    style: 'currency',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

export const brazilFormatter = new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    ...DEFAULT_OPTIONS,
});
