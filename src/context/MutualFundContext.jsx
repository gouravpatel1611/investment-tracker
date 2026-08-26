import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addMutualFundTransaction,
  getMutualFundTransactions,
  deleteMutualFundTransaction,
} from "../services/firebase/mutualFundService";

import {
  findMutualFundBySchemeCode,
} from "../services/api/mutualFundApi";

const MutualFundContext =
  createContext(null);

/* =========================================================
   GROUP TRANSACTIONS
========================================================= */

function buildHoldings(
  transactions,
  liveNavs
) {
  const groups = new Map();

  /* --------------------------------
     GROUP BY:

     SAME INVESTOR + SAME SCHEME

     Folio number grouping me use
     nahi ho raha.
  -------------------------------- */

  transactions.forEach(
    (transaction) => {
      const investorId =
        transaction.investorId || "";

      const schemeCode =
        String(
          transaction.schemeCode || ""
        ).trim();

      if (!schemeCode) return;

      const key =
        `${investorId}__${schemeCode}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups
        .get(key)
        .push(transaction);
    }
  );

  return Array.from(
    groups.entries()
  ).map(
    ([key, groupTransactions]) => {

      const first =
        groupTransactions[0];

      /* =====================================================
         TOTAL UNITS
      ===================================================== */

      const units =
        groupTransactions.reduce(
          (total, transaction) => {

            const type =
              String(
                transaction.type || ""
              ).toUpperCase();

            const transactionUnits =
              Number(
                transaction.units
              ) || 0;

            /*
              SELL / REDEEM
              units minus
            */

            if (
              type === "SELL" ||
              type === "REDEEM"
            ) {
              return (
                total -
                transactionUnits
              );
            }

            /*
              BUY / PURCHASE
              units plus
            */

            return (
              total +
              transactionUnits
            );
          },
          0
        );

      /* =====================================================
         INVESTED AMOUNT
      ===================================================== */

      const investedAmount =
        groupTransactions.reduce(
          (total, transaction) => {

            const type =
              String(
                transaction.type || ""
              ).toUpperCase();

            const amount =
              Number(
                transaction.amount
              ) || 0;

            /*
              SELL / REDEEM
              invested amount minus
            */

            if (
              type === "SELL" ||
              type === "REDEEM"
            ) {
              return (
                total -
                amount
              );
            }

            /*
              BUY
              invested amount plus
            */

            return (
              total +
              amount
            );
          },
          0
        );

      /* =====================================================
         PURCHASE UNITS
      ===================================================== */

      const purchaseUnits =
        groupTransactions.reduce(
          (total, transaction) => {

            const type =
              String(
                transaction.type || ""
              ).toUpperCase();

            if (
              type === "SELL" ||
              type === "REDEEM"
            ) {
              return total;
            }

            return (
              total +
              (Number(
                transaction.units
              ) || 0)
            );
          },
          0
        );

      /* =====================================================
         PURCHASE AMOUNT
      ===================================================== */

      const purchaseAmount =
        groupTransactions.reduce(
          (total, transaction) => {

            const type =
              String(
                transaction.type || ""
              ).toUpperCase();

            if (
              type === "SELL" ||
              type === "REDEEM"
            ) {
              return total;
            }

            return (
              total +
              (Number(
                transaction.amount
              ) || 0)
            );
          },
          0
        );

      /* =====================================================
         AVERAGE PURCHASE NAV

         Example:

         BUY 100 units @ ₹10
         BUY 200 units @ ₹12

         Average NAV =
         total purchase amount /
         total purchase units
      ===================================================== */

      const averageNav =
        purchaseUnits > 0
          ? purchaseAmount /
            purchaseUnits
          : Number(
              first.purchaseNav
            ) || 0;

      /* =====================================================
         FOLIO NUMBER

         IMPORTANT:

         Sab transactions me folio ho zaruri nahi.

         Jo pehla available folio milega
         wahi card par show hoga.
      ===================================================== */

      const folioTransaction =
        groupTransactions.find(
          (transaction) =>
            transaction.folioNumber &&
            String(
              transaction.folioNumber
            ).trim()
        );

      const folioNumber =
        folioTransaction
          ? String(
              folioTransaction.folioNumber
            ).trim()
          : "";

      /* =====================================================
         LATEST TRANSACTION

         Sirf fallback ke liye.
      ===================================================== */

      const latestTransaction =
        [...groupTransactions].sort(
          (a, b) =>
            new Date(
              b.purchaseDate
            ) -
            new Date(
              a.purchaseDate
            )
        )[0];

      /* =====================================================
         LIVE NAV

         API se latest available NAV.

         Agar API se NAV nahi mila,
         purchase NAV / average NAV fallback.
      ===================================================== */

      const schemeCode =
        String(
          first.schemeCode || ""
        ).trim();

      const liveNavData =
        liveNavs?.[schemeCode];

      const liveNav =
        Number(
          liveNavData?.nav
        );

      const fallbackNav =
        Number(
          latestTransaction?.purchaseNav
        ) ||
        averageNav ||
        0;

      const latestNav =
        Number.isFinite(liveNav) &&
        liveNav > 0
          ? liveNav
          : fallbackNav;

      /* =====================================================
         CURRENT VALUE

         CURRENT UNITS × CURRENT NAV
      ===================================================== */

      const currentValue =
        units * latestNav;

      /* =====================================================
         PROFIT / LOSS
      ===================================================== */

      const profitLoss =
        currentValue -
        investedAmount;

      /* =====================================================
         RETURN %
      ===================================================== */

      const returnPercent =
        investedAmount > 0
          ? (
              profitLoss /
              investedAmount
            ) * 100
          : 0;

      /* =====================================================
         RETURN HOLDING
      ===================================================== */

      return {
        id: key,

        investorId:
          first.investorId || "",

        investorName:
          first.investorName || "",

        schemeCode,

        schemeName:
          first.fundName ||
          first.schemeName ||
          "Mutual Fund",

        amcName:
          first.fundHouse ||
          first.amcName ||
          "",

        category:
          first.category || "",

        folioNumber,

        units,

        /*
          IMPORTANT:

          Ye ab purchase NAV nahi hai.

          Ye latest available/current NAV hai.
        */
        nav: latestNav,

        /*
          Actual latest NAV date
        */
        navDate:
          liveNavData?.date ||
          latestTransaction?.navDate ||
          null,

        /*
          true = API se live/latest NAV mila
        */
        isLiveNav:
          Number.isFinite(liveNav) &&
          liveNav > 0,

        investedAmount,

        currentValue,

        profitLoss,

        returnPercent,

        averageNav,

        transactions:
          groupTransactions,
      };
    }
  );
}

/* =========================================================
   PROVIDER
========================================================= */

export function MutualFundProvider({
  children,
}) {

  /* =======================================================
     FIREBASE TRANSACTIONS
  ======================================================= */

  const [
    transactions,
    setTransactions,
  ] = useState([]);

  /* =======================================================
     LIVE NAV DATA

     Structure:

     {
       "119551": {
         nav: 123.45,
         date: "2026-08-26"
       }
     }
  ======================================================= */

  const [
    liveNavs,
    setLiveNavs,
  ] = useState({});

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [
    navLoading,
    setNavLoading,
  ] = useState(false);

  /* =======================================================
     ERROR
  ======================================================= */

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD FIREBASE DATA
  ======================================================= */

  const loadTransactions =
    useCallback(async () => {

      setLoading(true);
      setError("");

      try {

        const data =
          await getMutualFundTransactions();

        setTransactions(data);

      } catch (error) {

        console.error(
          "Failed to load mutual fund data:",
          error
        );

        setError(
          "Unable to load mutual fund data."
        );

      } finally {

        setLoading(false);
      }

    }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadTransactions();

  }, [
    loadTransactions,
  ]);

  /* =======================================================
     FETCH LIVE NAVS

     Same scheme ke liye sirf ONE API call.

     Example:

     5 transactions
     2 investors
     same scheme

     → scheme ke liye 1 API call
  ======================================================= */

  useEffect(() => {

    if (
      !transactions ||
      transactions.length === 0
    ) {
      setLiveNavs({});
      return;
    }

    let cancelled = false;

    async function loadLiveNavs() {

      setNavLoading(true);

      try {

        /* --------------------------------
           UNIQUE SCHEME CODES
        -------------------------------- */

        const schemeCodes = [
          ...new Set(
            transactions
              .map(
                (transaction) =>
                  String(
                    transaction.schemeCode ||
                      ""
                  ).trim()
              )
              .filter(Boolean)
          ),
        ];

        if (
          schemeCodes.length === 0
        ) {
          setLiveNavs({});
          return;
        }

        /* --------------------------------
           FETCH ALL SCHEMES

           Promise.all means parallel
           requests.
        -------------------------------- */

        const results =
          await Promise.all(
            schemeCodes.map(
              async (
                schemeCode
              ) => {

                try {

                  const fund =
                    await findMutualFundBySchemeCode(
                      schemeCode
                    );

                  if (
                    !fund ||
                    !Array.isArray(
                      fund.navHistory
                    ) ||
                    fund.navHistory.length ===
                      0
                  ) {
                    return {
                      schemeCode,
                      nav: null,
                      date: null,
                    };
                  }

                  /* ------------------------------
                     FIND LATEST AVAILABLE NAV

                     API data ko date ke basis
                     par sort kar rahe hain.

                     Agar aaj NAV available hai
                     to aaj ka milega.

                     Agar aaj holiday hai / NAV
                     release nahi hua hai to
                     latest previous NAV milega.
                  ------------------------------ */

                  const sortedHistory =
                    [
                      ...fund.navHistory,
                    ].sort(
                      (a, b) =>
                        new Date(
                          b.date
                        ) -
                        new Date(
                          a.date
                        )
                    );

                  const latest =
                    sortedHistory.find(
                      (item) =>
                        Number.isFinite(
                          Number(
                            item.nav
                          )
                        ) &&
                        Number(
                          item.nav
                        ) > 0
                    );

                  if (!latest) {
                    return {
                      schemeCode,
                      nav: null,
                      date: null,
                    };
                  }

                  return {
                    schemeCode,

                    nav: Number(
                      latest.nav
                    ),

                    date:
                      latest.date ||
                      null,
                  };

                } catch (error) {

                  console.error(
                    `Failed to fetch NAV for scheme ${schemeCode}:`,
                    error
                  );

                  /*
                    Ek scheme fail hone par
                    poora mutual fund page
                    fail nahi hoga.
                  */

                  return {
                    schemeCode,
                    nav: null,
                    date: null,
                  };
                }
              }
            )
          );

        if (cancelled) {
          return;
        }

        /* --------------------------------
           CONVERT ARRAY → OBJECT
        -------------------------------- */

        const navMap = {};

        results.forEach(
          (item) => {

            if (
              item?.schemeCode
            ) {

              navMap[
                item.schemeCode
              ] = {
                nav:
                  item.nav,

                date:
                  item.date,
              };
            }
          }
        );

        setLiveNavs(navMap);

      } catch (error) {

        console.error(
          "Failed to load live mutual fund NAVs:",
          error
        );

        /*
          Existing Firebase data
          continue karega.
        */

      } finally {

        if (!cancelled) {
          setNavLoading(false);
        }
      }
    }

    loadLiveNavs();

    return () => {
      cancelled = true;
    };

  }, [transactions]);

  /* =======================================================
     ADD TRANSACTION
  ======================================================= */

  const addTransaction =
    useCallback(
      async (transaction) => {

        try {

          /*
            Firebase me save
          */

          const savedTransaction =
            await addMutualFundTransaction(
              transaction
            );

          /*
            IMPORTANT

            Firebase save ke turant baad
            Context state update.

            Reload ki zarurat nahi.
          */

          setTransactions(
            (current) => [
              savedTransaction,
              ...current,
            ]
          );

          return savedTransaction;

        } catch (error) {

          console.error(
            "Add transaction error:",
            error
          );

          throw error;
        }
      },
      []
    );

  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  const deleteTransaction =
    useCallback(
      async (id) => {

        if (!id) {
          throw new Error(
            "Transaction ID is required."
          );
        }

        /*
          PEHLE FIREBASE DELETE
        */

        await deleteMutualFundTransaction(
          id
        );

        /*
          FIREBASE SUCCESS KE BAAD
          LOCAL STATE UPDATE
        */

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
          liveNavs
        ),
      [
        transactions,
        liveNavs,
      ]
    );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({

        /*
          RAW TRANSACTIONS
        */
        transactions,

        /*
          GROUPED MUTUAL FUND CARDS
        */
        holdings,

        /*
          FIREBASE LOADING
        */
        loading,

        /*
          NAV API LOADING
        */
        navLoading,

        /*
          GENERAL ERROR
        */
        error,

        /*
          RELOAD FIREBASE DATA
        */
        reload:
          loadTransactions,

        /*
          ADD
        */
        addTransaction,

        /*
          DELETE
        */
        deleteTransaction,

      }),
      [
        transactions,
        holdings,
        loading,
        navLoading,
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
    <MutualFundContext.Provider
      value={value}
    >
      {children}
    </MutualFundContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useMutualFunds() {

  const context =
    useContext(
      MutualFundContext
    );

  if (!context) {

    throw new Error(
      "useMutualFunds must be used inside MutualFundProvider"
    );
  }

  return context;
}