
export function formatCurrency(
  value = 0
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value) || 0
  );

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
    Number(value) || 0
  );

}


export function formatDate(
  dateString
) {

  if (!dateString) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = String(dateString).split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return dateString;
  }

  return `${day}/${month}/${year}`;

}
