export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://www.nseindia.com/api/sovereign-gold-bonds",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/139 Safari/537.36",
          Referer: "https://www.nseindia.com/",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `NSE returned status ${response.status}`
      );
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("SGB API Error:", error);

    return res.status(500).json({
      error: "Failed to fetch SGB data from NSE",
      message: error.message,
    });
  }
}