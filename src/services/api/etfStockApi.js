/* =========================================================
   ETF / STOCK API
   Calls Vercel Serverless Function
========================================================= */

const MARKET_API =
  "/api/market";


/* =========================================================
   NORMALIZE SYMBOL
========================================================= */

function normalizeSymbol(
  symbol
) {

  return String(
    symbol || ""
  )
    .trim()
    .toUpperCase()
    .replace(
      /\.NS$/,
      ""
    );

}


/* =========================================================
   FIND ETF / STOCK
========================================================= */

export async function findETFStock(
  symbol
) {

  const cleanSymbol =
    normalizeSymbol(
      symbol
    );


  /* =======================================================
     VALIDATION
  ======================================================= */

  if (!cleanSymbol) {

    throw new Error(
      "Symbol is required."
    );

  }


  /* =======================================================
     API URL
  ======================================================= */

  const url =
    `${MARKET_API}?symbol=${encodeURIComponent(
      cleanSymbol
    )}`;


  try {

    /* =====================================================
       CALL VERCEL FUNCTION
    ===================================================== */

    const response =
      await fetch(
        url
      );


    /* =====================================================
       JSON
    ===================================================== */

    const data =
      await response.json();


    /* =====================================================
       ERROR
    ===================================================== */

    if (
      !response.ok ||
      data?.success === false
    ) {

      throw new Error(
        data?.error ||
        `Market API request failed: ${response.status}`
      );

    }


    /* =====================================================
       VALIDATE RESPONSE
    ===================================================== */

    const price =
      Number(
        data?.price
      );


    if (
      !Number.isFinite(
        price
      ) ||
      price <= 0
    ) {

      throw new Error(
        "Current price not available."
      );

    }


    /* =====================================================
       RETURN
    ===================================================== */

    return {

      success:
        true,

      symbol:
        normalizeSymbol(
          data?.symbol ||
          cleanSymbol
        ),

      name:
        data?.name ||
        "",

      price,

      assetType:
        data?.assetType ||
        "STOCK",

      changePercent:
        Number(
          data?.changePercent
        ) || 0,

    };

  } catch (error) {

    console.error(
      `Failed to fetch ETF / Stock data for ${cleanSymbol}:`,
      error
    );


    throw error;

  }

}