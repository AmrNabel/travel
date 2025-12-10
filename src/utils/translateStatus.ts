/**
 * Translates status strings to localized labels
 * @param status - The status string to translate
 * @param t - Translation function from useLanguage hook
 * @returns Translated status string
 */
export const translateStatus = (
  status: string,
  t: (key: string, options?: any) => string
): string => {
  const statusKey = status.toLowerCase().replace(/_/g, '');

  // Try to get translation from status namespace
  const translated = t(`status.${statusKey}`, { defaultValue: '' });

  // If translation exists, return it
  if (translated && translated !== `status.${statusKey}`) {
    return translated;
  }

  // Fallback: capitalize first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};
