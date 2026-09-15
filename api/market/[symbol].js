const YAHOO_BASE_URL =
  "https://query1.finance.yahoo.com/v8/finance/chart";


function normalizeSymbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/\.NS$/, "");
}


export default async function handler(
  req,
  res
) {
  try {

    const symbol =
      normalizeSymbol(
        req.query.symbol
      );


    if (!symbol) {

      return res.status(400).json({
        success: false,
        message:
          "Symbol is required.",
      });

    }


    const yahooSymbol =
      `${symbol}.NS`;


    const url =
      `${YAHOO_BASE_URL}/${encodeURIComponent(
        yahooSymbol
      )}?range=1d&interval=1m`;


    const response =
      await fetch(url);


    if (!response.ok) {

      return res.status(
        response.status
      ).json({
        success: false,
        message:
          `Yahoo Finance request failed: ${response.status}`,
      });

    }


    const data =
      await response.json();


    const result =
      data?.chart?.result?.[0];


    const meta =
      result?.meta;


    if (!meta) {

      return res.status(404).json({
        success: false,
        message:
          "No market data found for this symbol.",
      });

    }


    const price =
      Number(
        meta.regularMarketPrice
      );


    const name =
      meta.longName ||
      meta.shortName ||
      "";


    if (!name) {

      return res.status(404).json({
        success: false,
        message:
          "Name not found for this symbol.",
      });

    }


    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {

      return res.status(404).json({
        success: false,
        message:
          "Current price not available for this symbol.",
      });

    }


    const quoteType =
      String(
        meta.quoteType ||
        ""
      )
        .trim()
        .toUpperCase();


    let assetType =
      "STOCK";


    if (
      quoteType === "ETF"
    ) {
      assetType = "ETF";
    }


    return res.status(200).json({
      success: true,
      symbol,
      name,
      price,
      assetType,
    });

  } catch (error) {

    console.error(
      "Market API error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to fetch market data.",
    });

  }
}