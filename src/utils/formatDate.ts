import { format } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';

/**
 * Formats a date according to the current language
 * @param date - Date to format
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @param language - Current language ('en' or 'ar-EG')
 * @returns Formatted date string
 */
export const formatLocalizedDate = (
  date: Date | string | number,
  formatStr: string = 'MMM dd, yyyy',
  language: string = 'en'
): string => {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const locale = language === 'ar-EG' ? ar : enUS;

  return format(dateObj, formatStr, { locale });
};

/**
 * Formats a date to locale-specific string
 * @param date - Date to format
 * @param language - Current language ('en' or 'ar-EG')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatLocaleDate = (
  date: Date | string | number,
  language: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
): string => {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const locale = language === 'ar-EG' ? 'ar-EG' : 'en-US';

  return dateObj.toLocaleDateString(locale, options);
};
