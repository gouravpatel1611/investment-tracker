
/* =========================================
   MUTUAL FUND API PROXY
   MFAPI -> VERCEL SERVERLESS FUNCTION
========================================= */

export default async function handler(req, res) {
  // GET only
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // Scheme code from URL
  const schemeCode = String(
    req.query?.schemeCode || ""
  ).trim();

  // Validate scheme code
  if (!/^\d+$/.test(schemeCode)) {
    return res.status(400).json({
      error: "Invalid mutual fund scheme code",
    });
  }

  const apiUrl =
    `https://api.mfapi.in/mf/${encodeURIComponent(schemeCode)}`;

  // Retry temporary upstream failures
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      3500
    );

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "InvestmentTracker/1.0",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Scheme not found
      if (response.status === 404) {
        return res.status(404).json({
          status: "FAILED",
          message: "Scheme not found",
        });
      }

      // Temporary upstream failure
      if (
        response.status === 429 ||
        response.status >= 500
      ) {
        if (attempt < 2) {
          await new Promise((resolve) =>
            setTimeout(resolve, 300)
          );
          continue;
        }

        return res.status(502).json({
          error: "Mutual Fund API temporarily unavailable",
        });
      }

      if (!response.ok) {
        return res.status(502).json({
          error: `MFAPI returned ${response.status}`,
        });
      }

      const data = await response.json();

      if (!data || !data.meta) {
        return res.status(404).json({
          status: "FAILED",
          message: "Scheme data not found",
        });
      }

      // Cache successful response at Vercel edge
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=1800, stale-while-revalidate=21600"
      );

      return res.status(200).json(data);

    } catch (error) {
      clearTimeout(timeout);

      console.error(
        "Mutual Fund Proxy Error:",
        error.message
      );

      if (attempt === 2) {
        return res.status(502).json({
          error: "Unable to connect to Mutual Fund API",
        });
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    }
  }
}
