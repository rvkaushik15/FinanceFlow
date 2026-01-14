export const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export const EXCHANGE_RATES: Record<string, number> = {
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'INR': 83.12,
    'JPY': 148.0
};

const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'INR': 'en-IN',
    'EUR': 'en-IE',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
};

export const formatCurrency = (amount: number | string, currencyCode: string = 'USD') => {
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
    const num = Number(amount);
    const locale = localeMap[currencyCode] || 'en-US';

    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
            maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
        }).format(num);
    } catch (e) {
        return `${currency.symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
};

export const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || '$';
};
