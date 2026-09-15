/* =========================================================
   VERCEL SERVERLESS FUNCTION
   ETF / STOCK MARKET API
========================================================= */

export default async function handler(
  req,
  res
) {

  /* =======================================================
     CORS
  ======================================================= */

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  /* =======================================================
     OPTIONS
  ======================================================= */

  if (
    req.method ===
    "OPTIONS"
  ) {

    return res.status(200).end();

  }


  /* =======================================================
     ONLY GET
  ======================================================= */

  if (
    req.method !==
    "GET"
  ) {

    return res.status(405).json({

      success:
        false,

      error:
        "Method not allowed.",

    });

  }


  /* =======================================================
     SYMBOL
  ======================================================= */

  const rawSymbol =
    req.query?.symbol;


  const symbol =
    String(
      rawSymbol || ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /\.NS$/,
        ""
      );


  /* =======================================================
     VALIDATION
  ======================================================= */

  if (!symbol) {

    return res.status(400).json({

      success:
        false,

      error:
        "Symbol is required.",

    });

  }


  /* =======================================================
     YAHOO SYMBOL
  ======================================================= */

  const yahooSymbol =
    `${symbol}.NS`;


  /* =======================================================
     YAHOO URL
  ======================================================= */

  const yahooUrl =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?range=1d&interval=1d`;


  try {

    /* =====================================================
       CALL YAHOO FINANCE
    ===================================================== */

    const response =
      await fetch(
        yahooUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0",
            Accept:
              "application/json",
          },
        }
      );


    /* =====================================================
       RATE LIMIT
    ===================================================== */

    if (
      response.status ===
      429
    ) {

      return res.status(429).json({

        success:
          false,

        error:
          "Yahoo Finance rate limit reached. Please try again later.",

      });

    }


    /* =====================================================
       OTHER HTTP ERROR
    ===================================================== */

    if (
      !response.ok
    ) {

      return res.status(
        response.status
      ).json({

        success:
          false,

        error:
          `Yahoo Finance request failed: ${response.status}`,

      });

    }


    /* =====================================================
       JSON
    ===================================================== */

    const data =
      await response.json();


    /* =====================================================
       YAHOO RESULT
    ===================================================== */

    const result =
      data?.chart?.result?.[0];


    const meta =
      result?.meta;


    if (!meta) {

      return res.status(404).json({

        success:
          false,

        error:
          "No market data found for this symbol.",

      });

    }


    /* =====================================================
       NAME
    ===================================================== */

    const name =
      meta.longName ||
      meta.shortName ||
      "";


    if (!name) {

      return res.status(404).json({

        success:
          false,

        error:
          "Name not found for this symbol.",

      });

    }


    /* =====================================================
       CURRENT PRICE
    ===================================================== */

    const price =
      Number(
        meta.regularMarketPrice
      );


    if (
      !Number.isFinite(
        price
      ) ||
      price <= 0
    ) {

      return res.status(404).json({

        success:
          false,

        error:
          "Current price not available for this symbol.",

      });

    }


    /* =====================================================
       ASSET TYPE
    ===================================================== */

    const instrumentType =
      String(
        meta.instrumentType ||
        ""
      )
        .trim()
        .toUpperCase();


    let assetType =
      "STOCK";


    if (
      instrumentType ===
      "ETF"
    ) {

      assetType =
        "ETF";

    }


    /* =====================================================
       CHANGE %
    ===================================================== */

    const changePercent =
      Number(
        meta.regularMarketChangePercent
      );


    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(200).json({

      success:
        true,

      symbol,

      name,

      price,

      assetType,

      changePercent:
        Number.isFinite(
          changePercent
        )
          ? changePercent
          : 0,

    });

  } catch (error) {

    console.error(
      "Yahoo Finance API error:",
      error
    );


    return res.status(500).json({

      success:
        false,

      error:
        "Unable to fetch market data.",

    });

  }

}