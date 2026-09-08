import * as cheerio from "cheerio";

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

    const url = `https://retailbonds.in/bond/${isin}/detail`;

    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
      },
    });

   if (!response.ok) {
    const errorText = await response.text();

    console.error(
        "RetailBonds Error:",
        response.status,
        errorText
    );

    return res.status(response.status).json({
        success: false,
        error: `RetailBonds returned ${response.status}`,
        status: response.status,
    });
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // -----------------------------
    // Helper
    // -----------------------------

    function matchValue(regex) {
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    }

    // -----------------------------
    // Bond Name
    // -----------------------------

    let bondName = "";

    const title =
      $("h1").first().text().trim() ||
      $("title").text().trim();

    if (title) {
      bondName = title
        .replace(/\s*\|\s*RetailBonds.*$/i, "")
        .trim();
    }

    // -----------------------------
    // Structured Overview
    // -----------------------------

    const structuredStart = text.indexOf(
      "Structured Overview"
    );

    const riskStart = text.indexOf("Risk warning:");

    const structured =
      structuredStart !== -1
        ? text.slice(
            structuredStart,
            riskStart !== -1
              ? riskStart
              : undefined
          )
        : text;

    // -----------------------------
    // Issuer
    // -----------------------------

    const issuerMatch = structured.match(
      /Issuer\s+(.+?)\s+Instrument Type\s+/i
    );

    const issuer = issuerMatch
      ? issuerMatch[1].trim()
      : "";

    // -----------------------------
    // Bond Type
    // -----------------------------

    const bondTypeMatch = structured.match(
      /Instrument Type\s+(.+?)\s+Issue Date\s+/i
    );

    const bondType = bondTypeMatch
      ? bondTypeMatch[1].trim()
      : "";

    // -----------------------------
    // Issue Date
    // -----------------------------

    const issueDate =
      matchValue(
        /Issue Date\s+(\d{4}-\d{2}-\d{2})/i
      ) || "";

    // -----------------------------
    // Maturity Date
    // -----------------------------

    let maturityDate = "";

    const maturityMatch = text.match(
      /Maturity Date\s+(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/i
    );

    if (maturityMatch) {
      const day = maturityMatch[1].padStart(2, "0");
      const monthName = maturityMatch[2];
      const year = maturityMatch[3];

      const months = {
        jan: "01",
        january: "01",
        feb: "02",
        february: "02",
        mar: "03",
        march: "03",
        apr: "04",
        april: "04",
        may: "05",
        jun: "06",
        june: "06",
        jul: "07",
        july: "07",
        aug: "08",
        august: "08",
        sep: "09",
        sept: "09",
        september: "09",
        oct: "10",
        october: "10",
        nov: "11",
        november: "11",
        dec: "12",
        december: "12",
      };

      const month =
        months[monthName.toLowerCase()];

      if (month) {
        maturityDate = `${year}-${month}-${day}`;
      }
    }

    // -----------------------------
    // Coupon Rate
    // -----------------------------

    const couponRateMatch = text.match(
      /Coupon Rate\s+([\d.]+)%/i
    );

    const couponRate = couponRateMatch
      ? Number(couponRateMatch[1])
      : 0;

    // -----------------------------
    // Coupon Frequency
    // -----------------------------

    let couponFrequency = "";

    const frequencyMatch = text.match(
      /(?:Interest Payment|Payment Frequency)\s+(Quarterly|Monthly|Half-Yearly|Half Yearly|Yearly|Annual|Semi-Annual|Semi Annual)\s+Frequency/i
    );

    if (frequencyMatch) {
      couponFrequency = frequencyMatch[1]
        .replace(/Half Yearly/i, "Half-Yearly")
        .replace(/Semi Annual/i, "Semi-Annual");
    }

    // -----------------------------
    // Face Value
    // -----------------------------

    const faceValueMatch = text.match(
      /Face Value\s+₹\s*([\d,]+(?:\.\d+)?)\s+Per Bond/i
    );

    const faceValue = faceValueMatch
      ? Number(
          faceValueMatch[1].replace(/,/g, "")
        )
      : 0;

    // -----------------------------
    // Rating
    // -----------------------------

    let rating = "";

    const ratingMatch = text.match(
      /Credit Rating\s+([A-Z][A-Z0-9+\-]*)\s*\(/i
    );

    if (ratingMatch) {
      rating = ratingMatch[1].trim();
    }

    // -----------------------------
    // Current Price
    // -----------------------------

    const priceMatch = text.match(
      /Current Price\s*\(Clean\)\s+₹\s*([\d,]+(?:\.\d+)?)/i
    );

    const currentPrice = priceMatch
      ? Number(
          priceMatch[1].replace(/,/g, "")
        )
      : 0;

    // -----------------------------
    // Current Yield / YTM
    // -----------------------------

    let currentYield = 0;

    const ytmMatch = text.match(
      /YTM\s*([\d.]+)%\s+Trade Date/i
    );

    if (ytmMatch) {
      currentYield = Number(ytmMatch[1]);
    }

    // -----------------------------
    // Final Clean Object
    // -----------------------------

    const bond = {
      isin,

      bondName,

      issuer,

      bondType,

      faceValue,

      couponRate,

      couponFrequency,

      issueDate,

      maturityDate,

      rating,

      currentPrice,

      currentYield,

      source: "RetailBonds",

      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      data: bond,
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