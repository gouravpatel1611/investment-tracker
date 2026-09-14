export function formatCurrency(
  value = 0
) {
  const roundedValue = Math.round(
    Number(value) || 0
  );

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(roundedValue);
}

export function formatNumber(
  value = 0
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  ).format(
    Math.round(Number(value) || 0)
  );
}

export function formatPercentage(
  value = 0
) {
  return `${Number(value || 0).toFixed(2)}%`;
}

export function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}