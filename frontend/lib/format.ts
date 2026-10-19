const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: string): Intl.NumberFormat {
  let formatter = formatters.get(locale);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    formatters.set(locale, formatter);
  }

  return formatter;
}

/**
 * Formats a whole-unit amount using the currency symbol and locale authored in
 * AEM, e.g. (329, "en-IN", "₹") -> "₹329".
 */
export function formatMoney(
  amount: number,
  locale = "en-IN",
  currencySymbol = "₹"
): string {
  return `${currencySymbol}${formatterFor(locale).format(amount)}`;
}
