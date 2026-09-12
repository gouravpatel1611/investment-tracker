export function formatCurrency(
  value = 0
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(Number(value) || 0);
}

export function formatNumber(
  value = 0
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  ).format(Number(value) || 0);
}

export function formatPercent(
  value = 0
) {
  return `${Number(
    value || 0
  ).toFixed(2)}%`;
}

export function formatDate(
  value
) {
  if (!value) return "";

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

/**
 * Compact date for monthly table.
 *
 * Example:
 *
 * 01-Apr-26
 * 01-May-26
 */
export function formatShortDate(
  value
) {
  if (!value) return "";

  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month =
    date.toLocaleString(
      "en-IN",
      {
        month: "short",
      }
    );

  const year = String(
    date.getFullYear()
  ).slice(-2);

  return `${day}-${month}-${year}`;
}

export function getCurrentFinancialYear() {
  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    today.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${String(
      year + 1
    ).slice(-2)}`;
  }

  return `${year - 1}-${String(
    year
  ).slice(-2)}`;
}

export function getFinancialYearDates(
  financialYear
) {
  const [startYear] =
    String(financialYear)
      .split("-")
      .map(Number);

  return {
    startDate: `${startYear}-04-01`,

    endDate: `${startYear + 1}-03-31`,
  };
}

export function getQuarterForMonth(
  monthIndex
) {
  /**
   * JS:
   *
   * Jan = 0
   * Feb = 1
   * Mar = 2
   * Apr = 3
   * ...
   */

  if (
    monthIndex >= 3 &&
    monthIndex <= 5
  ) {
    return "Q1";
  }

  if (
    monthIndex >= 6 &&
    monthIndex <= 8
  ) {
    return "Q2";
  }

  if (
    monthIndex >= 9 &&
    monthIndex <= 11
  ) {
    return "Q3";
  }

  return "Q4";
}

export function getQuarterLabel(
  quarter
) {
  const labels = {
    Q1: "Apr – Jun",
    Q2: "Jul – Sep",
    Q3: "Oct – Dec",
    Q4: "Jan – Mar",
  };

  return (
    labels[quarter] ||
    quarter
  );
}