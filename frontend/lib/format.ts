const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Formats a whole-rupee amount, e.g. 329 -> "₹329". */
export function formatMoney(amount: number): string {
  return inr.format(amount);
}
