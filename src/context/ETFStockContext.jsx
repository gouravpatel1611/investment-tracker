import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addETFStockTransaction,
  getETFStockTransactions,
  deleteETFStockTransaction,
} from "../services/firebase/etfStockService";

import {
  findETFStock,
} from "../services/api/etfStockApi";

import { useAuth } from "./AuthContext";


const ETFStockContext =
  createContext(null);


/* =========================================================
   PRICE CACHE
========================================================= */

/*
  Same symbol ke liye baar-baar API request nahi jayegi.

  Cache duration:
  5 minutes
*/

const PRICE_CACHE_DURATION =
  5 * 60 * 1000;


/* =========================================================
   NORMALIZE SYMBOL
========================================================= */

function normalizeSymbol(
  symbol
) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/\.NS$/, "");
}


/* =========================================================
   GET TRANSACTION TYPE
========================================================= */

function getTransactionType(
  transaction
) {
  return String(
    transaction?.transactionType ||
    transaction?.type ||
    ""
  )
    .trim()
    .toUpperCase();
}


/* =========================================================
   BUILD HOLDINGS
========================================================= */

function buildHoldings(
  transactions,
  livePrices
) {

  const groups =
    new Map();


  /* =======================================================
     GROUP BY SYMBOL
  ======================================================= */

  transactions.forEach(
    (transaction) => {

      const symbol =
        normalizeSymbol(
          transaction?.symbol
        );


      if (!symbol) {
        return;
      }


      if (
        !groups.has(
          symbol
        )
      ) {

        groups.set(
          symbol,
          []
        );

      }


      groups
        .get(symbol)
        .push(
          transaction
        );

    }
  );


  /* =======================================================
     BUILD HOLDINGS
  ======================================================= */

  return Array.from(
    groups.entries()
  )
    .map(
      ([
        symbol,
        groupTransactions,
      ]) => {

        const first =
          groupTransactions[0];


        /* =================================================
           BUY UNITS
        ================================================= */

        const buyUnits =
          groupTransactions.reduce(
            (
              total,
              transaction
            ) => {

              if (
                getTransactionType(
                  transaction
                ) !== "BUY"
              ) {
                return total;
              }


              return (
                total +
                (
                  Number(
                    transaction.units
                  ) || 0
                )
              );

            },
            0
          );


        /* =================================================
           SELL UNITS
        ================================================= */

        const sellUnits =
          groupTransactions.reduce(
            (
              total,
              transaction
            ) => {

              if (
                getTransactionType(
                  transaction
                ) !== "SELL"
              ) {
                return total;
              }


              return (
                total +
                (
                  Number(
                    transaction.units
                  ) || 0
                )
              );

            },
            0
          );


        /* =================================================
           REMAINING UNITS
        ================================================= */

        const units =
          Math.max(
            0,
            buyUnits -
              sellUnits
          );


        /* =================================================
           BUY AMOUNT
        ================================================= */

        const buyAmount =
          groupTransactions.reduce(
            (
              total,
              transaction
            ) => {

              if (
                getTransactionType(
                  transaction
                ) !== "BUY"
              ) {
                return total;
              }


              return (
                total +
                (
                  Number(
                    transaction.amount
                  ) || 0
                )
              );

            },
            0
          );


        /* =================================================
           SELL AMOUNT
        ================================================= */

        const sellAmount =
          groupTransactions.reduce(
            (
              total,
              transaction
            ) => {

              if (
                getTransactionType(
                  transaction
                ) !== "SELL"
              ) {
                return total;
              }


              return (
                total +
                (
                  Number(
                    transaction.amount
                  ) || 0
                )
              );

            },
            0
          );


        /* =================================================
           AVERAGE BUY PRICE
        ================================================= */

        const averageBuyPrice =
          buyUnits > 0
            ? buyAmount /
              buyUnits
            : 0;


        /* =================================================
           LIVE PRICE
        ================================================= */

        const livePriceData =
          livePrices?.[symbol];


        const livePrice =
          Number(
            livePriceData?.price
          );


        const fallbackPrice =
          Number(
            first?.currentPrice
          ) ||
          averageBuyPrice ||
          0;


        const currentPrice =
          Number.isFinite(
            livePrice
          ) &&
          livePrice > 0
            ? livePrice
            : fallbackPrice;


        /* =================================================
           CURRENT VALUE
        ================================================= */

        const currentValue =
          units *
          currentPrice;


        /* =================================================
           REMAINING INVESTED AMOUNT
        ================================================= */

        const remainingInvestedAmount =
          units *
          averageBuyPrice;


        /* =================================================
           UNREALIZED P/L
        ================================================= */

        const unrealizedProfitLoss =
          currentValue -
          remainingInvestedAmount;


        /* =================================================
           REALIZED COST
        ================================================= */

        const realizedCost =
          sellUnits *
          averageBuyPrice;


        /* =================================================
           REALIZED P/L
        ================================================= */

        const realizedProfitLoss =
          sellAmount -
          realizedCost;


        /* =================================================
           TOTAL P/L
        ================================================= */

        const totalProfitLoss =
          unrealizedProfitLoss +
          realizedProfitLoss;


        /* =================================================
           NET INVESTMENT
        ================================================= */

        const investedAmount =
          buyAmount -
          sellAmount;


        /* =================================================
           RETURN %
        ================================================= */

        const returnPercent =
          investedAmount > 0
            ? (
                totalProfitLoss /
                investedAmount
              ) *
              100
            : 0;


        /* =================================================
           RETURN HOLDING
        ================================================= */

        return {

          id:
            symbol,

          symbol,

          name:
            livePriceData?.name ||
            first?.name ||
            "ETF / Stock",

          assetType:
            livePriceData?.assetType ||
            first?.assetType ||
            "STOCK",

          units,

          buyUnits,

          sellUnits,

          buyAmount,

          sellAmount,

          investedAmount,

          averageBuyPrice,

          currentPrice,

          currentValue,

          remainingInvestedAmount,

          realizedProfitLoss,

          unrealizedProfitLoss,

          profitLoss:
            totalProfitLoss,

          returnPercent,

          priceUpdatedAt:
            livePriceData?.updatedAt ||
            null,

          isLivePrice:
            Number.isFinite(
              livePrice
            ) &&
            livePrice > 0,

          transactions:
            groupTransactions,

        };

      }
    )
    .filter(
      (holding) =>
        holding.units > 0
    );
}


/* =========================================================
   PROVIDER
========================================================= */

export function ETFStockProvider({
  children,
}) {

  /* =======================================================
     AUTH
  ======================================================= */

  const {
    user,
    loading: authLoading,
  } = useAuth();


  /* =======================================================
     TRANSACTIONS
  ======================================================= */

  const [
    transactions,
    setTransactions,
  ] = useState([]);


  /* =======================================================
     LIVE PRICES
  ======================================================= */

  const [
    livePrices,
    setLivePrices,
  ] = useState({});


  /* =======================================================
     LOADING
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    priceLoading,
    setPriceLoading,
  ] = useState(false);


  /* =======================================================
     ERROR
  ======================================================= */

  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     PRICE CACHE REF
  ======================================================= */

  const priceCacheRef =
    useRef({});


  /* =======================================================
     LOAD TRANSACTIONS
  ======================================================= */

  const loadTransactions =
    useCallback(
      async () => {

        if (authLoading) {
          return;
        }


        if (!user?.uid) {

          setTransactions([]);

          setLivePrices({});

          priceCacheRef.current = {};

          setLoading(false);

          return;
        }


        setLoading(true);

        setError("");


        try {

          const data =
            await getETFStockTransactions();


          setTransactions(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (error) {

          console.error(
            "Failed to load ETF / Stock transactions:",
            error
          );


          setError(
            "Unable to load ETF / Stock data."
          );

        } finally {

          setLoading(false);

        }

      },
      [
        user?.uid,
        authLoading,
      ]
    );


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    if (authLoading) {
      return;
    }


    loadTransactions();

  }, [
    authLoading,
    loadTransactions,
  ]);


  /* =======================================================
     FETCH LIVE PRICES
========================================================= */

  useEffect(() => {

    if (
      !transactions ||
      transactions.length === 0
    ) {

      setLivePrices({});

      setPriceLoading(false);

      return;

    }


    let cancelled =
      false;


    async function loadLivePrices() {

      /* ===================================================
         UNIQUE SYMBOLS
      =================================================== */

      const symbols = [
        ...new Set(
          transactions
            .map(
              (
                transaction
              ) =>
                normalizeSymbol(
                  transaction?.symbol
                )
            )
            .filter(Boolean)
        ),
      ];


      if (
        symbols.length === 0
      ) {

        setLivePrices({});

        return;

      }


      const now =
        Date.now();


      /* ===================================================
         EXISTING CACHE
      =================================================== */

      const cachedPrices =
        priceCacheRef.current;


      const priceMap =
        {};


      const symbolsToFetch =
        [];


      /* ===================================================
         CHECK CACHE
      =================================================== */

      symbols.forEach(
        (symbol) => {

          const cached =
            cachedPrices?.[symbol];


          if (
            cached &&
            (
              now -
              cached.timestamp
            ) <
              PRICE_CACHE_DURATION
          ) {

            priceMap[symbol] =
              cached.data;

          } else {

            symbolsToFetch.push(
              symbol
            );

          }

        }
      );


      /* ===================================================
         SET CACHED DATA IMMEDIATELY
      =================================================== */

      if (
        !cancelled &&
        Object.keys(priceMap).length > 0
      ) {

        setLivePrices(
          priceMap
        );

      }


      /* ===================================================
         NOTHING TO FETCH
      =================================================== */

      if (
        symbolsToFetch.length === 0
      ) {

        setPriceLoading(false);

        return;

      }


      setPriceLoading(true);


      try {

        /*
          IMPORTANT:

          Yahoo ko ek saath bahut saari
          requests nahi bhejenge.

          Sequential request use kar rahe hain.
        */

        for (
          const symbol of
          symbolsToFetch
        ) {

          if (cancelled) {
            break;
          }


          try {

            const data =
              await findETFStock(
                symbol
              );


            const price =
              Number(
                data?.price
              );


            const priceData = {

              name:
                data?.name ||
                "",

              assetType:
                data?.assetType ||
                "STOCK",

              price:
                Number.isFinite(
                  price
                ) &&
                price > 0
                  ? price
                  : null,

              updatedAt:
                new Date()
                  .toISOString(),

            };


            /* =============================================
               SAVE TO CACHE
            ============================================= */

            priceCacheRef.current[
              symbol
            ] = {

              data:
                priceData,

              timestamp:
                Date.now(),

            };


            /* =============================================
               UPDATE UI
            ============================================= */

            if (!cancelled) {

              setLivePrices(
                (current) => ({

                  ...current,

                  [symbol]:
                    priceData,

                })
              );

            }


          } catch (error) {

            console.error(
              `Failed to fetch price for ${symbol}:`,
              error
            );


            /*
              Error hone par cached old price
              available ho to usko remove nahi
              karenge.
            */

          }

        }

      } catch (error) {

        console.error(
          "Failed to load ETF / Stock prices:",
          error
        );

      } finally {

        if (!cancelled) {

          setPriceLoading(
            false
          );

        }

      }

    }


    loadLivePrices();


    return () => {

      cancelled = true;

    };

  }, [
    transactions,
  ]);


  /* =======================================================
     ADD TRANSACTION
  ======================================================= */

  const addTransaction =
    useCallback(
      async (
        transaction
      ) => {

        const normalizedTransaction = {

          ...transaction,

          symbol:
            normalizeSymbol(
              transaction?.symbol
            ),

        };


        const savedTransaction =
          await addETFStockTransaction(
            normalizedTransaction
          );


        /* =================================================
           IMMEDIATELY UPDATE UI
        ================================================= */

        setTransactions(
          (current) => [
            savedTransaction,
            ...current,
          ]
        );


        /*
          Agar symbol ka cached price nahi hai,
          to add ke baad fetch ho jayega.

          Agar already cache mein hai,
          to unnecessary API request nahi jayegi.
        */


        return savedTransaction;

      },
      []
    );


  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  const deleteTransaction =
    useCallback(
      async (
        id
      ) => {

        if (!id) {

          throw new Error(
            "Transaction ID is required."
          );

        }


        await deleteETFStockTransaction(
          id
        );


        /* =================================================
           IMMEDIATELY UPDATE UI
        ================================================= */

        setTransactions(
          (current) =>
            current.filter(
              (item) =>
                item.id !== id
            )
        );


        return true;

      },
      []
    );


  /* =======================================================
     HOLDINGS
  ======================================================= */

  const holdings =
    useMemo(
      () =>
        buildHoldings(
          transactions,
          livePrices
        ),
      [
        transactions,
        livePrices,
      ]
    );


  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary =
    useMemo(
      () => {

        const totalInvested =
          holdings.reduce(
            (
              total,
              holding
            ) =>
              total +
              (
                Number(
                  holding.investedAmount
                ) || 0
              ),
            0
          );


        const totalCurrentValue =
          holdings.reduce(
            (
              total,
              holding
            ) =>
              total +
              (
                Number(
                  holding.currentValue
                ) || 0
              ),
            0
          );


        const totalProfitLoss =
          holdings.reduce(
            (
              total,
              holding
            ) =>
              total +
              (
                Number(
                  holding.profitLoss
                ) || 0
              ),
            0
          );


        const totalReturnPercent =
          totalInvested > 0
            ? (
                totalProfitLoss /
                totalInvested
              ) *
              100
            : 0;


        return {

          totalInvested,

          totalCurrentValue,

          totalProfitLoss,

          totalReturnPercent,

          totalHoldings:
            holdings.length,

        };

      },
      [
        holdings,
      ]
    );


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({

        transactions,

        holdings,

        summary,

        loading,

        priceLoading,

        error,

        reload:
          loadTransactions,

        addTransaction,

        deleteTransaction,

      }),
      [
        transactions,
        holdings,
        summary,
        loading,
        priceLoading,
        error,
        loadTransactions,
        addTransaction,
        deleteTransaction,
      ]
    );


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <ETFStockContext.Provider
      value={value}
    >
      {children}
    </ETFStockContext.Provider>
  );
}


/* =========================================================
   HOOK
========================================================= */

export function useETFStock() {

  const context =
    useContext(
      ETFStockContext
    );


  if (!context) {

    throw new Error(
      "useETFStock must be used inside ETFStockProvider"
    );

  }


  return context;
}