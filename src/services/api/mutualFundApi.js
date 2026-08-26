const API_BASE_URL = "https://api.mfapi.in";

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

  /*
    Empty scheme code
  */

  if (!code) {
    return null;
  }

  /*
    Basic validation
    Mutual fund scheme codes are numeric.
  */

  if (!/^\d+$/.test(code)) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/mf/${encodeURIComponent(
        code
      )}`
    );

    /*
      WRONG SCHEME CODE
      API normally returns 404.
    */

    if (response.status === 404) {
      return null;
    }

    /*
      Other server errors
    */

    if (!response.ok) {
      throw new Error(
        `Mutual fund API error: ${response.status}`
      );
    }

    const data =
      await response.json();

    /*
      API returned unsuccessful response
    */

    if (
      !data ||
      data.status === "FAILED" ||
      !data.meta
    ) {
      return null;
    }

    const fund =
      normalizeFundResponse(data);

    /*
      Safety check
    */

    if (
      !fund ||
      !fund.schemeCode ||
      !fund.name
    ) {
      return null;
    }

    return fund;

  } catch (error) {
    console.error(
      "Scheme search error:",
      error
    );

    /*
      Network/server error ko
      not-found nahi banana hai.
    */

    throw error;
  }
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