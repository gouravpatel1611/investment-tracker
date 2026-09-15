import http from "node:http";

const PORT = 3001;

const server = http.createServer(
  async (req, res) => {

    console.log("=================================");
    console.log("YAHOO TEST API REACHED");
    console.log("METHOD:", req.method);
    console.log("URL:", req.url);
    console.log("=================================");

    try {

      const symbol = "TCS.NS";

      const yahooURL = new URL(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
      );

      yahooURL.searchParams.set(
        "range",
        "1d"
      );

      yahooURL.searchParams.set(
        "interval",
        "1m"
      );

      console.log(
        "Calling Yahoo:",
        yahooURL.toString()
      );

      const response = await fetch(
        yahooURL,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0"
          }
        }
      );

      console.log(
        "YAHOO STATUS:",
        response.status
      );

      const text =
        await response.text();

      console.log(
        "YAHOO RAW RESPONSE:"
      );

      console.log(text);

      res.writeHead(
        response.ok ? 200 : response.status,
        {
          "Content-Type":
            "application/json"
        }
      );

      res.end(text);

    } catch (error) {

      console.error(
        "YAHOO ERROR:",
        error
      );

      res.writeHead(
        500,
        {
          "Content-Type":
            "application/json"
        }
      );

      res.end(
        JSON.stringify({
          success: false,
          error: error.message
        })
      );
    }
  }
);

server.listen(
  PORT,
  () => {
    console.log(
      `Test server running at http://localhost:${PORT}`
    );
  }
);