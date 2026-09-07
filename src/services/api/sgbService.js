const NSE_SGB_API = "/api/sgb";

// ==========================================
// GET ALL SGB DATA FROM NSE
// ==========================================

const getSGBData = async () => {
  const response = await fetch(NSE_SGB_API, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`NSE API Error: ${response.status}`);
  }

  const data = await response.json();

  return data?.data || [];
};

// ==========================================
// FIND SGB BY SERIES CODE
// ==========================================

export const findSGBBySeriesCode = async (seriesCode) => {
  if (!seriesCode?.trim()) {
    throw new Error("SGB Series Code is required");
  }

  const normalizedCode = seriesCode.trim().toUpperCase();

  try {
    const sgbList = await getSGBData();

    const sgb = sgbList.find(
      (item) =>
        item.symbol?.trim().toUpperCase() === normalizedCode
    );

    if (!sgb) {
      throw new Error(
        `SGB Series Code "${normalizedCode}" not found`
      );
    }

    // ==========================================
    // NORMALIZED SGB DATA
    // ==========================================

    return {
      // ========================================
      // SGB BASIC DETAILS
      // ========================================

      seriesCode: sgb.symbol || normalizedCode,

      // Issue Price from NSE
      issuePrice: Number(sgb.issue_price || 0),

      // ========================================
      // MARKET PRICE
      // ========================================

      currentPrice: Number(sgb.ltP || 0),

      previousClose: Number(sgb.prevClose || 0),

      change: Number(sgb.chn || 0),

      percentChange: Number(sgb.per || 0),

      // ========================================
      // MARKET DATA
      // ========================================

      open: Number(sgb.open || 0),

      high: Number(sgb.high || 0),

      low: Number(sgb.low || 0),

      // ========================================
      // NSE EXTRA DATA
      // ========================================

      quantity: Number(sgb.qty || 0),

      tradingValue: Number(sgb.trdVal || 0),

      weekHigh: Number(sgb.wkhi || 0),

      weekLow: Number(sgb.wklo || 0),

      change30Days: Number(sgb.perChange30d || 0),

      change365Days: Number(sgb.perChange365d || 0),

      // ========================================
      // CHARTS
      // ========================================

      chartTodayPath: sgb.chartTodayPath || "",

      chart30dPath: sgb.chart30dPath || "",

      chart365dPath: sgb.chart365dPath || "",

      // ========================================
      // SERIES
      // ========================================

      series: sgb.series || "",

      // ========================================
      // RAW DATA
      // ========================================

      rawData: sgb,
    };
  } catch (error) {
    console.error("SGB API Error:", error);

    throw new Error(
      error.message || "Unable to fetch SGB details"
    );
  }
};