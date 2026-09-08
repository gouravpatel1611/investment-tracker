
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

    // Basic ISIN validation
    if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin)) {
      return res.status(400).json({
        success: false,
        error: "Invalid ISIN",
        isin,
      });
    }

    const url =
      `https://www.cdslindia.com/CorporateBond/CorpBondDatabase.aspx?ISIN=${encodeURIComponent(
        isin
      )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) " +
          "Chrome/139.0.0.0 Safari/537.36",

        Referer: "https://www.cdslindia.com/",
      },
    });

    const html = await response.text();

    if (!response.ok) {
      console.error("CDSL Error:", response.status, html);

      return res.status(response.status).json({
        success: false,
        error: `CDSL returned ${response.status}`,
        status: response.status,
      });
    }

    const $ = cheerio.load(html);

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    const clean = (value) =>
      String(value || "")
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const findValue = (...labels) => {
      let result = "";

      $("tr").each((_, row) => {
        if (result) return;

        const cells = $(row)
          .find("th, td")
          .map((__, cell) => clean($(cell).text()))
          .get()
          .filter(Boolean);

        if (cells.length < 2) return;

        const label = cells[0].toLowerCase();

        for (const wanted of labels) {
          if (label === wanted.toLowerCase()) {
            result = cells[1];
            return;
          }
        }
      });

      return result;
    };

    // --------------------------------------------------
    // Page text
    // --------------------------------------------------

    const pageText = clean($("body").text());

    // --------------------------------------------------
    // ISIN
    // --------------------------------------------------

    let foundIsin = "";

    const isinMatch = pageText.match(
      /ISIN\s*(?:Code)?\s*:\s*([A-Z]{2}[A-Z0-9]{9}[0-9])/i
    );

    if (isinMatch) {
      foundIsin = isinMatch[1].toUpperCase();
    }

    // --------------------------------------------------
    // ISIN Description
    // --------------------------------------------------

    let bondName = "";

    const descriptionMatch = pageText.match(
      /ISIN\s+Description\s*:\s*(.*?)(?=\s+Issuer Details|\s+Instrument Details)/i
    );

    if (descriptionMatch) {
      bondName = clean(descriptionMatch[1]);
    }

    // Fallback: heading based extraction
    if (!bondName) {
      $("h4, h3, h2").each((_, el) => {
        if (bondName) return;

        const text = clean($(el).text());

        if (/ISIN\s+Description/i.test(text)) {
          bondName = clean(
            text.replace(/ISIN\s+Description\s*:?\s*/i, "")
          );
        }
      });
    }

    // --------------------------------------------------
    // Issuer
    // --------------------------------------------------

    const issuer =
      findValue("Issuer Name") ||
      findValue("Issuer");

    // --------------------------------------------------
    // Instrument
    // --------------------------------------------------

    const instrumentDescription =
      findValue("Instrument Description");

    const instrumentType =
      findValue("Type of Instrument");

    const shortDescription =
      findValue("ISIN Short Description");

    const secured =
      findValue("Whether Secured or Unsecured");

    const guaranteed =
      findValue("Whether Guaranteed or Partially Guaranteed");

    const convertibility =
      findValue("Type of Convertibility");

    const seniority =
      findValue("Seniority In Payment");

    const taxFree =
      findValue("Whether Tax Free");

    const series =
      findValue("Series");

    const tranche =
      findValue("Tranche No.");

    // --------------------------------------------------
    // Face Value
    // --------------------------------------------------

    const faceValueRaw =
      findValue("Face Value/Security");

    const faceValue =
      parseNumber(faceValueRaw);

    // --------------------------------------------------
    // Coupon
    // --------------------------------------------------

    let couponRate = 0;

    const couponLabels = [
      "Coupon Rate",
      "Interest Rate",
      "Rate of Interest",
      "Coupon",
    ];

    for (const label of couponLabels) {
      const value = findValue(label);

      if (value) {
        const match = value.match(/[\d.]+/);

        if (match) {
          couponRate = Number(match[0]);
          break;
        }
      }
    }

    // Fallback: search page text
    if (!couponRate) {
      const couponMatch = pageText.match(
        /(?:Coupon Rate|Interest Rate|Rate of Interest)\s*:?\s*([\d.]+)\s*%/i
      );

      if (couponMatch) {
        couponRate = Number(couponMatch[1]);
      }
    }

    // --------------------------------------------------
    // Frequency
    // --------------------------------------------------

    let couponFrequency =
      findValue(
        "Frequency",
        "Interest Frequency",
        "Coupon Frequency"
      );

    // Avoid taking Payment Status frequency if possible
    if (!couponFrequency) {
      const frequencyMatch = pageText.match(
        /(?:Interest Frequency|Coupon Frequency|Frequency)\s*:\s*(Monthly|Quarterly|Half Yearly|Half-Yearly|Yearly|Annual|At Maturity)/i
      );

      if (frequencyMatch) {
        couponFrequency = frequencyMatch[1];
      }
    }

    // --------------------------------------------------
    // Dates
    // --------------------------------------------------

    const issueDate =
      findValue(
        "Date of Allotment",
        "Issue Date",
        "Date of Issue",
        "Allotment Date"
      );

    let maturityDate =
      findValue(
        "Maturity Date",
        "Redemption Date",
        "Date of Maturity"
      );

    // CDSL can expose maturity inside redemption section
    if (!maturityDate) {
      const maturityMatch = pageText.match(
        /(?:Maturity Date|Date of Maturity|Redemption Date)\s*:?\s*([\d\/-]{8,10})/i
      );

      if (maturityMatch) {
        maturityDate = maturityMatch[1];
      }
    }

    // --------------------------------------------------
    // Rating
    // --------------------------------------------------

    let rating = "";

    const ratingLabels = [
      "Credit Rating",
      "Rating",
      "Credit Rating Agency",
    ];

    for (const label of ratingLabels) {
      const value = findValue(label);

      if (value) {
        rating = value;
        break;
      }
    }

    // --------------------------------------------------
    // Tenure
    // --------------------------------------------------

    const tenure =
      findValue("Tenure");

    // --------------------------------------------------
    // Redemption
    // --------------------------------------------------

    const redemptionType =
      findValue("Type of Redemption");

    const redemptionMaturity =
      findValue(
        "Due date for Redemption/Maturity",
        "Due date for Redemption / Maturity",
        "Redemption / Maturity"
      );

    // --------------------------------------------------
    // Validate CDSL result
    // --------------------------------------------------

    const hasBondData =
      foundIsin ||
      bondName ||
      issuer ||
      instrumentDescription;

    if (!hasBondData) {
      return res.status(404).json({
        success: false,
        error: "Bond not found in CDSL database",
        isin,
      });
    }

    // --------------------------------------------------
    // Final normalized response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        isin: foundIsin || isin,

        bondName:
          bondName ||
          instrumentDescription ||
          shortDescription ||
          "",

        issuer: issuer || "",

        bondType:
          instrumentType || "",

        instrumentDescription:
          instrumentDescription || "",

        shortDescription:
          shortDescription || "",

        faceValue,

        couponRate,

        couponFrequency:
          couponFrequency || "",

        issueDate:
          issueDate || "",

        maturityDate:
          maturityDate ||
          redemptionMaturity ||
          "",

        rating:
          rating || "",

        tenure:
          tenure || "",

        secured:
          secured || "",

        guaranteed:
          guaranteed || "",

        convertibility:
          convertibility || "",

        seniority:
          seniority || "",

        taxFree:
          taxFree || "",

        series:
          series || "",

        tranche:
          tranche || "",

        redemptionType:
          redemptionType || "",

        source: "CDSL Corporate Bond Database",

        sourceUrl: url,
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

// --------------------------------------------------
// Number helper
// --------------------------------------------------

function parseNumber(value) {
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/[₹$]/g, "")
    .trim();

  const match = cleaned.match(/-?[\d.]+/);

  return match ? Number(match[0]) : 0;
}

