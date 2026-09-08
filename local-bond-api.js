import http from "http";
import * as cheerio from "cheerio";

const PORT = 3001;

async function getBondData(isin) {
  const url = `https://retailbonds.in/bond/${isin}/detail`;

  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error("Bond not found");
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

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

  // Issuer
  const issuerMatch = structured.match(
    /Issuer\s+(.+?)\s+Instrument Type\s+/i
  );

  const issuer = issuerMatch
    ? issuerMatch[1].trim()
    : "";

  // Bond Type
  const bondTypeMatch = structured.match(
    /Instrument Type\s+(.+?)\s+Issue Date\s+/i
  );

  const bondType = bondTypeMatch
    ? bondTypeMatch[1].trim()
    : "";

  // Issue Date
  const issueMatch = structured.match(
    /Issue Date\s+(\d{4}-\d{2}-\d{2})/i
  );

  const issueDate = issueMatch
    ? issueMatch[1]
    : "";

  // Bond Name
  const bondName =
    $("h1").first().text().trim() ||
    $("title").text().trim();

  // Coupon
  const couponMatch = text.match(
    /Coupon Rate\s+([\d.]+)%/i
  );

  const couponRate = couponMatch
    ? Number(couponMatch[1])
    : 0;

  // Face Value
  const faceMatch = text.match(
    /Face Value\s+₹\s*([\d,]+(?:\.\d+)?)\s+Per Bond/i
  );

  const faceValue = faceMatch
    ? Number(
        faceMatch[1].replace(/,/g, "")
      )
    : 0;

  // Frequency
  const frequencyMatch = text.match(
    /(?:Interest Payment|Payment Frequency)\s+(Quarterly|Monthly|Half-Yearly|Half Yearly|Yearly|Annual|Semi-Annual|Semi Annual)\s+Frequency/i
  );

  const couponFrequency = frequencyMatch
    ? frequencyMatch[1]
        .replace(/Half Yearly/i, "Half-Yearly")
        .replace(/Semi Annual/i, "Semi-Annual")
    : "";

  // Rating
  const ratingMatch = text.match(
    /Credit Rating\s+([A-Z][A-Z0-9+\-]*)\s*\(/i
  );

  const rating = ratingMatch
    ? ratingMatch[1]
    : "";

  // Maturity
  let maturityDate = "";

  const maturityMatch = text.match(
    /Maturity Date\s+(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})/i
  );

  if (maturityMatch) {
    const day = maturityMatch[1].padStart(2, "0");
    const monthName =
      maturityMatch[2].toLowerCase();
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

    const month = months[monthName];

    if (month) {
      maturityDate = `${year}-${month}-${day}`;
    }
  }

  // Current Price
  const priceMatch = text.match(
    /Current Price\s*\(Clean\)\s+₹\s*([\d,]+(?:\.\d+)?)/i
  );

  const currentPrice = priceMatch
    ? Number(
        priceMatch[1].replace(/,/g, "")
      )
    : 0;

  // YTM
  const ytmMatch = text.match(
    /YTM\s*([\d.]+)%\s+Trade Date/i
  );

  const currentYield = ytmMatch
    ? Number(ytmMatch[1])
    : 0;

  return {
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
}

const server = http.createServer(
  async (req, res) => {
    // CORS
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    if (
      req.method === "OPTIONS"
    ) {
      res.writeHead(200);
      res.end();
      return;
    }

    const match = req.url.match(
      /^\/api\/bonds\/([^/]+)$/
    );

    if (!match) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          success: false,
          error: "API route not found",
        })
      );

      return;
    }

    const isin = decodeURIComponent(
      match[1]
    ).toUpperCase();

    try {
      const data =
        await getBondData(isin);

      res.writeHead(200, {
        "Content-Type":
          "application/json",
      });

      res.end(
        JSON.stringify({
          success: true,
          data,
        })
      );
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type":
          "application/json",
      });

      res.end(
        JSON.stringify({
          success: false,
          error: error.message,
        })
      );
    }
  }
);

server.listen(PORT, () => {
  console.log(
    `Bond API running at http://localhost:${PORT}`
  );
});