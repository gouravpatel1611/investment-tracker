
export default async function handler(req, res) {
  try {
    const isin = String(req.query.isin || "")
      .trim()
      .toUpperCase();

    if (!isin) {
      return res.status(400).json({
        success: false,
        error: "ISIN is required",
      });
    }

    const response = await fetch(
      "https://bricsonline.nseindia.com/bondsnew/rest/v1/marketwatch/activeissues",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
        },
        body: JSON.stringify({
          symbol: isin,
        }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("NSE CBRICS Error:", response.status, text);

      return res.status(response.status).json({
        success: false,
        error: `NSE returned ${response.status}`,
        details: text,
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        success: false,
        error: "Invalid JSON response from NSE",
        details: text,
      });
    }

    // NSE response array ho sakta hai
    const bond = Array.isArray(data) ? data[0] : data;

    if (!bond) {
      return res.status(404).json({
        success: false,
        error: "Bond not found",
        isin,
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        isin: bond.symbol || isin,

        bondName: bond.description || "",

        issuer: bond.issuer || "",

        bondType: bond.type || "",

        issueDate: bond.issueDate || "",

        maturityDate: bond.maturityDate || "",

        couponRate: Number(bond.couponRate) || 0,

        rating: bond.creditRating || "",

        currentPrice:
          Number(bond.lastTradePrice) || 0,

        currentYield:
          Number(bond.avgYield) || 0,

        avgTradePrice:
          Number(bond.avgTradePrice) || 0,

        lastTradeValue:
          Number(bond.lastTradeValue) || 0,

        lastTradeTime:
          bond.lastTradeTime || "",

        totalTrades:
          Number(bond.totNoOfTrades) || 0,

        totalTradeValue:
          Number(bond.totTradeValue) || 0,

        source: "NSE CBRICS",
      },
    });
  } catch (error) {
    console.error("Bond API Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch bond data",
      message: error.message,
    });
  }
}

