export function formatINR(
  value,
  options = {}
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
      ...options,
    }
  ).format(value ?? 0);
}