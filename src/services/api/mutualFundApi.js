const API_BASE_URL = "/api/mf";






/* --------------------------------
   API DATE → YYYY-MM-DD
-------------------------------- */

function convertApiDateToISO(dateString) {
  if (!dateString) {
    return null;
  }

  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
}


/* --------------------------------
   NORMALIZE FUND
-------------------------------- */

function normalizeFundResponse(data) {
  if (!data?.meta) {
    return null;
  }

  return {
    schemeCode: String(
      data.meta.scheme_code || ""
    ),

    name:
      data.meta.scheme_name || "",

    fundHouse:
      data.meta.fund_house || "",

    category:
      data.meta.scheme_category || "",

    schemeType:
      data.meta.scheme_type || "",

    isinGrowth:
      data.meta.isin_growth || null,

    isinDividend:
      data.meta.isin_div_reinvestment || null,

    navHistory:
      Array.isArray(data.data)
        ? data.data
            .map((item) => ({
              date:
                convertApiDateToISO(
                  item.date
                ),

              nav: Number(item.nav),
            }))
            .filter(
              (item) =>
                item.date &&
                Number.isFinite(item.nav)
            )
        : [],
  };
}


/* --------------------------------
   FIND FUND BY SCHEME CODE
-------------------------------- */


export async function findMutualFundBySchemeCode(
  schemeCode
) {
  const code = String(
    schemeCode || ""
  ).trim();

  if (!code || !/^\d+$/.test(code)) {
    return null;
  }

  const url =
    `${API_BASE_URL}/${encodeURIComponent(code)}`;

  let lastError;

  // Retry up to 2 attempts
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      12000
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 404) {
        return null;
      }

      if (
        [429, 502, 503, 504].includes(
          response.status
        ) && attempt < 2
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
        continue;
      }

      if (!response.ok) {
        throw new Error(
          `Mutual Fund API error: ${response.status}`
        );
      }

      const data = await response.json();

      if (
        !data ||
        data.status === "FAILED" ||
        !data.meta
      ) {
        return null;
      }

      const fund = normalizeFundResponse(data);

      if (
        !fund ||
        !fund.schemeCode ||
        !fund.name
      ) {
        return null;
      }

      return fund;

    } catch (error) {
      lastError = error;

      if (attempt === 2) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

    } finally {
      clearTimeout(timeout);
    }
  }

  console.error(
    "Scheme search error:",
    lastError
  );

  throw lastError || new Error(
    "Unable to fetch mutual fund data"
  );
}



/* --------------------------------
   GET HISTORICAL NAV
-------------------------------- */

export async function getHistoricalNav(
  scheme,
  date
) {
  if (!scheme || !date) {
    return {
      nav: null,
      actualDate: null,
      isPreviousDate: false,
    };
  }

  const history =
    Array.isArray(
      scheme.navHistory
    )
      ? scheme.navHistory
      : [];

  if (history.length === 0) {
    return {
      nav: null,
      actualDate: null,
      isPreviousDate: false,
    };
  }

  /*
    Exact date
  */

  const exactRecord =
    history.find(
      (item) =>
        item.date === date
    );

  if (exactRecord) {
    return {
      nav: exactRecord.nav,
      actualDate: exactRecord.date,
      isPreviousDate: false,
    };
  }

  /*
    Previous available NAV
  */

  const previousRecords =
    history
      .filter(
        (item) =>
          item.date < date
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(
            a.date
          )
      );

  if (
    previousRecords.length === 0
  ) {
    return {
      nav: null,
      actualDate: null,
      isPreviousDate: false,
    };
  }

  const previous =
    previousRecords[0];

  return {
    nav: previous.nav,

    actualDate:
      previous.date,

    isPreviousDate:
      previous.date !== date,
  };
}