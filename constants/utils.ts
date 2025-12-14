import { languageKey } from './languageKeys';

export function formatNumberByLocale(number: number, language: keyof typeof languageKey, currency?: string) {
  const locale = !!language ? languageKey[language] : navigator.language;
  const extra_options: {
    style?: 'currency' | 'decimal' | 'percent' | 'unit',
    currency?: string, 
  } = !!currency ? {
    style: 'currency',
    currency: currency.toUpperCase()
  } : {}
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...extra_options
  }).format(number);
}

export function parseErrors(errors: {}[]): {errorFields: string[], errorMessage: {[key: string]: string}} {
    const fields = new Set<string>();
    const errorMessage: { [key: string]: string } = {};
    errors.forEach((err: any) => {
        if (err.path && err.path.length > 0) {
            const field = err.path[0];
            fields.add(field);
            errorMessage[field] = err.message;
        }
    });
    const errorFields = Array.from(fields);
    return {errorFields, errorMessage};
}

export function formatCurrency(
  amount: number,
  currency: string,
  exchangeRate: number = 1,
): string {
  const convertedAmount = amount * exchangeRate;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(convertedAmount);
}

export function formatPips(pips: number): string {
  return pips.toFixed(2);
}

export function getSystemTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function localizeTimeZoneName(timeZone: string, language?: keyof typeof languageKey) {
  const date = new Date();

  const parts = new Intl.DateTimeFormat(languageKey[language ?? 'en'], {
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date);

  const tzPart = parts.find(p => p.type === 'timeZoneName');
  return tzPart?.value || timeZone;
}


export function formatDate(date: Date | string, language?: keyof typeof languageKey, showTime?: boolean): string {
  const locale = !!language ? languageKey[language] : navigator.language;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...(showTime && { hour: '2-digit', minute: '2-digit'})
  }).format(new Date(date));
}
