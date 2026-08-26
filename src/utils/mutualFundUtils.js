/* --------------------------------
   FORMAT CURRENCY
-------------------------------- */

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

/* --------------------------------
   FORMAT UNITS
-------------------------------- */

export function formatUnits(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

/* --------------------------------
   TODAY DATE
-------------------------------- */

export function getTodayDate() {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* --------------------------------
   FORMAT DATE
-------------------------------- */

export function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* --------------------------------
   NORMALIZE NUMBER
-------------------------------- */

export function number(value) {
  const result = Number(value);

  return Number.isFinite(result)
    ? result
    : 0;
}