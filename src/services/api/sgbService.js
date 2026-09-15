const NSE_SGB_API = "/api/sgb";

// ==========================================================
// CACHE
// ==========================================================

let sgbDataCache = null;
let sgbDataPromise = null;

// Cache kitne time tak valid rahega
// 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

let cacheTime = 0;

// ==========================================================
// GET ALL SGB DATA FROM NSE
// ==========================================================

export const getSGBData = async ({
  forceRefresh = false,
} = {}) => {
  const now = Date.now();

  // --------------------------------------------------------
  // Return cached data
  // --------------------------------------------------------

  if (
    !forceRefresh &&
    sgbDataCache &&
    now - cacheTime < CACHE_DURATION
  ) {
    return sgbDataCache;
  }

  // --------------------------------------------------------
  // If request already running
  // Don't create another NSE request
  // --------------------------------------------------------

  if (
    !forceRefresh &&
    sgbDataPromise
  ) {
    return sgbDataPromise;
  }

  // --------------------------------------------------------
  // Create API request
  // --------------------------------------------------------

  sgbDataPromise = fetch(
    NSE_SGB_API,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `NSE API Error: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      const sgbList =
        Array.isArray(data?.data)
          ? data.data
          : [];

      // ----------------------------------------------------
      // Save cache
      // ----------------------------------------------------

      sgbDataCache = sgbList;
      cacheTime = Date.now();

      return sgbList;
    })
    .catch((error) => {
      console.error(
        "Failed to fetch SGB data from NSE:",
        error
      );

      throw error;
    })
    .finally(() => {
      sgbDataPromise = null;
    });

  return sgbDataPromise;
};

// ==========================================================
// CREATE SGB MARKET DATA MAP
// ==========================================================
//
// Example:
//
// {
//   SGBJAN29IX: {...},
//   SGBAPR30IX: {...},
//   SGBJUL30IX: {...}
// }
//
// Isse kisi series ko find karna bahut fast ho jayega.
// ==========================================================

export const getSGBDataMap = async ({
  forceRefresh = false,
} = {}) => {
  const sgbList =
    await getSGBData({
      forceRefresh,
    });

  const map = {};

  for (
    const item of sgbList
  ) {
    const symbol =
      item?.symbol
        ?.trim()
        .toUpperCase();

    if (!symbol) {
      continue;
    }

    map[symbol] = item;
  }

  return map;
};

// ==========================================================
// FIND SGB BY SERIES CODE
// ==========================================================

export const findSGBBySeriesCode = async (
  seriesCode
) => {
  if (!seriesCode?.trim()) {
    throw new Error(
      "SGB Series Code is required"
    );
  }

  const normalizedCode =
    seriesCode
      .trim()
      .toUpperCase();

  try {
    const sgbList =
      await getSGBData();

    const sgb =
      sgbList.find(
        (item) =>
          item?.symbol
            ?.trim()
            .toUpperCase() ===
          normalizedCode
      );

    if (!sgb) {
      throw new Error(
        `SGB Series Code "${normalizedCode}" not found`
      );
    }

    return normalizeSGBData(
      sgb,
      normalizedCode
    );
  } catch (error) {
    console.error(
      "SGB API Error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to fetch SGB details"
    );
  }
};

// ==========================================================
// NORMALIZE SGB DATA
// ==========================================================

export const normalizeSGBData = (
  sgb,
  fallbackSeriesCode = ""
) => {
  if (!sgb) {
    return null;
  }

  return {
    // ======================================================
    // BASIC DETAILS
    // ======================================================

    seriesCode:
      sgb.symbol ||
      fallbackSeriesCode,

    issuePrice:
      Number(
        sgb.issue_price || 0
      ),

    // ======================================================
    // MARKET PRICE
    // ======================================================

    currentPrice:
      Number(
        sgb.ltP || 0
      ),

    previousClose:
      Number(
        sgb.prevClose || 0
      ),

    change:
      Number(
        sgb.chn || 0
      ),

    percentChange:
      Number(
        sgb.per || 0
      ),

    // ======================================================
    // MARKET DATA
    // ======================================================

    open:
      Number(
        sgb.open || 0
      ),

    high:
      Number(
        sgb.high || 0
      ),

    low:
      Number(
        sgb.low || 0
      ),

    // ======================================================
    // NSE EXTRA DATA
    // ======================================================

    quantity:
      Number(
        sgb.qty || 0
      ),

    tradingValue:
      Number(
        sgb.trdVal || 0
      ),

    weekHigh:
      Number(
        sgb.wkhi || 0
      ),

    weekLow:
      Number(
        sgb.wklo || 0
      ),

    change30Days:
      Number(
        sgb.perChange30d || 0
      ),

    change365Days:
      Number(
        sgb.perChange365d || 0
      ),

    // ======================================================
    // CHARTS
    // ======================================================

    chartTodayPath:
      sgb.chartTodayPath ||
      "",

    chart30dPath:
      sgb.chart30dPath ||
      "",

    chart365dPath:
      sgb.chart365dPath ||
      "",

    // ======================================================
    // SERIES
    // ======================================================

    series:
      sgb.series ||
      "",

    // ======================================================
    // RAW DATA
    // ======================================================

    rawData:
      sgb,
  };
};

// ==========================================================
// FIND MULTIPLE SGBs AT ONCE
// ==========================================================
//
// Portfolio service isme ek hi NSE request ka use karega.
// ==========================================================

export const findSGBsBySeriesCodes = async (
  seriesCodes = []
) => {
  if (
    !Array.isArray(seriesCodes) ||
    seriesCodes.length === 0
  ) {
    return {};
  }

  const sgbMap =
    await getSGBDataMap();

  const result = {};

  for (
    const seriesCode of seriesCodes
  ) {
    const normalizedCode =
      String(
        seriesCode || ""
      )
        .trim()
        .toUpperCase();

    if (!normalizedCode) {
      continue;
    }

    const sgb =
      sgbMap[normalizedCode];

    if (!sgb) {
      continue;
    }

    result[normalizedCode] =
      normalizeSGBData(
        sgb,
        normalizedCode
      );
  }

  return result;
};

// ==========================================================
// CLEAR CACHE
// ==========================================================
//
// Jab manually fresh NSE data chahiye ho:
// clearSGBDataCache();
// ==========================================================

export const clearSGBDataCache =
  () => {
    sgbDataCache = null;
    sgbDataPromise = null;
    cacheTime = 0;
  };