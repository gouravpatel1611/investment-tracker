
function toNumber(value) {
  return Number(value) || 0;
}

/**
 * Complete months between two dates.
 *
 * Rules:
 *
 * 14 Aug -> 13 Sep = 1 month
 * 14 Aug -> 14 Sep = 1 month
 *
 * 15 Jan -> 14 Feb = 1 month
 * 15 Jan -> 15 Feb = 1 month
 *
 * 01 Apr -> 31 Mar = 12 months
 *
 * Last day of the month is considered
 * complete according to the opening date.
 */
export function getCompleteMonths(
  openingDate,
  endDate = new Date()
) {
  if (!openingDate || !endDate) {
    return 0;
  }

  const start = new Date(
    `${openingDate}T00:00:00`
  );

  const end =
    endDate instanceof Date
      ? new Date(endDate)
      : new Date(
          `${endDate}T00:00:00`
        );

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return 0;
  }

  if (end < start) {
    return 0;
  }

  /*
   * Basic calendar month difference.
   */
  let months =
    (end.getFullYear() -
      start.getFullYear()) *
      12 +
    (end.getMonth() -
      start.getMonth());

  /*
   * ------------------------------------------------
   * CASE 1
   * Opening date is the 1st and end date is the
   * last day of a month.
   *
   * Example:
   *
   * 01 Apr 2026 -> 31 Mar 2027
   *
   * Calendar difference = 11
   * But actual FD period = 12 months.
   *
   * 01 Apr -> 30 Apr = 1 month
   * 01 Apr -> 31 May = 2 months
   * ------------------------------------------------
   */
  const lastDayOfEndMonth =
    new Date(
      end.getFullYear(),
      end.getMonth() + 1,
      0
    ).getDate();

  const isLastDayOfMonth =
    end.getDate() ===
    lastDayOfEndMonth;

  if (
    start.getDate() === 1 &&
    isLastDayOfMonth
  ) {
    return Math.max(
      months + 1,
      0
    );
  }

  /*
   * ------------------------------------------------
   * CASE 2
   * Normal date-to-date calculation.
   *
   * Example:
   *
   * 14 Aug -> 14 Sep = 1
   * 14 Aug -> 13 Sep = 1
   *
   * Because one day before the same date
   * is considered a complete month.
   * ------------------------------------------------
   */
  const anniversary =
    new Date(start);

  /*
   * Avoid JavaScript month overflow problems
   * such as 31 Jan -> 31 Feb.
   */
  const targetYear =
    start.getFullYear() +
    Math.floor(
      (start.getMonth() + months) / 12
    );

  const targetMonth =
    (start.getMonth() + months) % 12;

  const daysInTargetMonth =
    new Date(
      targetYear,
      targetMonth + 1,
      0
    ).getDate();

  anniversary.setFullYear(
    targetYear
  );

  anniversary.setMonth(
    targetMonth
  );

  anniversary.setDate(
    Math.min(
      start.getDate(),
      daysInTargetMonth
    )
  );

  /*
   * Same date = complete month.
   */
  if (end >= anniversary) {
    return Math.max(
      months,
      0
    );
  }

  /*
   * One day before anniversary is also
   * considered a complete month.
   *
   * Example:
   *
   * 14 Aug -> 13 Sep = 1
   * 15 Jan -> 14 Feb = 1
   */
  const oneDayBefore =
    new Date(anniversary);

  oneDayBefore.setDate(
    oneDayBefore.getDate() - 1
  );

  if (end >= oneDayBefore) {
    return Math.max(
      months,
      0
    );
  }

  /*
   * Month is not complete.
   */
  return Math.max(
    months - 1,
    0
  );
}

/**
 * Total complete months between
 * opening and closing date.
 */
export function getDurationMonths(
  openingDate,
  closingDate
) {
  if (
    !openingDate ||
    !closingDate
  ) {
    return 0;
  }

  return getCompleteMonths(
    openingDate,
    closingDate
  );
}

/**
 * Total FD interest.
 *
 * Simple interest calculation:
 *
 * Principal × Rate × Months / 12
 */
export function calculateTotalInterest(fd) {
  const principal =
    toNumber(fd?.principal);

  const rate =
    toNumber(fd?.interestRate);

  const months =
    getDurationMonths(
      fd?.openingDate,
      fd?.closingDate
    );

  if (
    principal <= 0 ||
    rate <= 0 ||
    months <= 0
  ) {
    return 0;
  }

  return (
    principal *
    (rate / 100) *
    (months / 12)
  );
}

/**
 * Interest earned till current date.
 *
 * Only complete months are counted.
 *
 * If FD has already matured,
 * closing date is used.
 */
export function calculateTillMonthInterest(
  fd,
  currentDate = new Date()
) {
  const principal =
    toNumber(fd?.principal);

  const rate =
    toNumber(fd?.interestRate);

  if (
    principal <= 0 ||
    rate <= 0 ||
    !fd?.openingDate
  ) {
    return 0;
  }

  let endDate =
    currentDate instanceof Date
      ? new Date(currentDate)
      : new Date(currentDate);

  /*
   * Do not calculate beyond FD closing date.
   */
  if (fd?.closingDate) {
    const closingDate =
      new Date(
        `${fd.closingDate}T00:00:00`
      );

    if (
      !Number.isNaN(
        closingDate.getTime()
      ) &&
      closingDate < endDate
    ) {
      endDate = closingDate;
    }
  }

  const months =
    getCompleteMonths(
      fd.openingDate,
      endDate
    );

  if (months <= 0) {
    return 0;
  }

  return (
    principal *
    (rate / 100) *
    (months / 12)
  );
}

/**
 * Profit percentage.
 *
 * Total Interest / Total Principal × 100
 */
export function calculateProfitPercentage(
  totalPrincipal,
  totalInterest
) {
  const principal =
    toNumber(totalPrincipal);

  const interest =
    toNumber(totalInterest);

  if (principal <= 0) {
    return 0;
  }

  return (
    (interest / principal) *
    100
  );
}

/**
 * Calculate all values for one FD.
 */
export function calculateFdDetails(fd) {
  const totalInterest =
    calculateTotalInterest(fd);

  const tillMonthInterest =
    calculateTillMonthInterest(fd);

  const durationMonths =
    getDurationMonths(
      fd?.openingDate,
      fd?.closingDate
    );

  return {
    totalInterest,
    tillMonthInterest,
    durationMonths,
  };
}

/**
 * Calculate complete summary.
 */
export function calculateFdSummary(
  fds = []
) {
  const totalPrincipal =
    fds.reduce(
      (total, fd) =>
        total +
        toNumber(fd?.principal),
      0
    );

  const totalInterest =
    fds.reduce(
      (total, fd) =>
        total +
        calculateTotalInterest(fd),
      0
    );

  const totalTillMonthInterest =
    fds.reduce(
      (total, fd) =>
        total +
        calculateTillMonthInterest(fd),
      0
    );

  const profitPercentage =
    calculateProfitPercentage(
      totalPrincipal,
      totalInterest
    );

  return {
    totalPrincipal,
    totalInterest,
    totalTillMonthInterest,
    profitPercentage,
  };
}
