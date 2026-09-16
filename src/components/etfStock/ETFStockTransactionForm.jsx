
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  Loader2,
  Plus,
  Search,
  ShoppingCart,
  TrendingDown,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  findETFStock,
} from "../../services/api/etfStockApi";

import {
  useETFStock,
} from "../../context/ETFStockContext";

import { useNavigate } from "react-router-dom";

/* =========================================================
   TODAY
========================================================= */

function getToday() {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
  value
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(
    Number(value) || 0
  );
}


/* =========================================================
   COMPONENT
========================================================= */

export default function ETFStockTransactionForm({
  defaultSymbol = "",
  onSaved,
  onBack,
}) {

  const navigate = useNavigate();

  const {
    addTransaction,
    holdings,
  } = useETFStock();


  const cleanDefaultSymbol =
    String(
      defaultSymbol || ""
    )
      .trim()
      .toUpperCase()
      .replace(/\.NS$/, "");


  const isFixedSymbol =
    Boolean(
      cleanDefaultSymbol
    );


  /* =======================================================
     SYMBOL
  ======================================================= */

  const [
    symbol,
    setSymbol,
  ] = useState(
    cleanDefaultSymbol
  );


  const [
    asset,
    setAsset,
  ] = useState(null);


  const [
    searching,
    setSearching,
  ] = useState(false);


  const [
    searchError,
    setSearchError,
  ] = useState("");


  /* =======================================================
     TRANSACTION
  ======================================================= */

  const [
    transactionType,
    setTransactionType,
  ] = useState("BUY");


  const [
    units,
    setUnits,
  ] = useState("");


  const [
    amount,
    setAmount,
  ] = useState("");


  const [
    transactionDate,
    setTransactionDate,
  ] = useState(
    getToday()
  );


  /* =======================================================
     SAVE
  ======================================================= */

  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    saveError,
    setSaveError,
  ] = useState("");


  /* =======================================================
     SEARCH SYMBOL
  ======================================================= */

  async function searchSymbol(
    value
  ) {

    const cleanSymbol =
      String(value || "")
        .trim()
        .toUpperCase()
        .replace(/\.NS$/, "");


    if (!cleanSymbol) {

      setSearchError(
        "Please enter a symbol."
      );

      return;
    }


    setSearching(true);

    setSearchError("");

    setAsset(null);


    try {

      const result =
        await findETFStock(
          cleanSymbol
        );


      setAsset(result);

    } catch (error) {

      console.error(
        "ETF / Stock search error:",
        error
      );


      setSearchError(
        error?.message ||
        "Unable to find this symbol."
      );

    } finally {

      setSearching(false);

    }
  }


  /* =======================================================
     AUTO SEARCH DEFAULT SYMBOL
  ======================================================= */

  useEffect(() => {

    if (!cleanDefaultSymbol) {
      return;
    }


    setSymbol(
      cleanDefaultSymbol
    );


    searchSymbol(
      cleanDefaultSymbol
    );

  }, [
    cleanDefaultSymbol,
  ]);


  /* =======================================================
     AVAILABLE UNITS
  ======================================================= */

  function getAvailableUnits() {

    if (!asset?.symbol) {
      return 0;
    }


    const cleanSymbol =
      String(
        asset.symbol
      )
        .trim()
        .toUpperCase()
        .replace(/\.NS$/, "");


    return (
      holdings || []
    )
      .filter(
        (holding) =>
          String(
            holding.symbol || ""
          )
            .trim()
            .toUpperCase()
            .replace(/\.NS$/, "") ===
          cleanSymbol
      )
      .reduce(
        (
          total,
          holding
        ) =>
          total +
          (
            Number(
              holding.units
            ) || 0
          ),
        0
      );
  }


  /* =======================================================
     UNITS INPUT
  ======================================================= */

  function handleUnitsChange(
    value
  ) {

    if (
      value === "" ||
      /^\d*\.?\d*$/.test(
        value
      )
    ) {

      setUnits(value);

      setSaveError("");

    }
  }


  /* =======================================================
     AMOUNT INPUT
  ======================================================= */

  function handleAmountChange(
    value
  ) {

    if (
      value === "" ||
      /^\d*\.?\d*$/.test(
        value
      )
    ) {

      setAmount(value);

      setSaveError("");

    }
  }


  /* =======================================================
     CHANGE TRANSACTION TYPE
  ======================================================= */

  function handleTransactionTypeChange(
    type
  ) {

    setTransactionType(
      type
    );

    setSaveError("");

  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setSaveError("");


    /* -------------------------------------------------------
       SYMBOL VALIDATION
    ------------------------------------------------------- */

    if (!asset) {

      setSaveError(
        "Please search for a valid Stock / ETF symbol first."
      );

      return;
    }


    /* -------------------------------------------------------
       UNITS
    ------------------------------------------------------- */

    const numericUnits =
      Number(units);


    if (
      !Number.isFinite(
        numericUnits
      ) ||
      numericUnits <= 0
    ) {

      setSaveError(
        "Please enter valid units."
      );

      return;
    }


    /* -------------------------------------------------------
       AMOUNT
    ------------------------------------------------------- */

    const numericAmount =
      Number(amount);


    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {

      setSaveError(
        "Please enter valid transaction amount."
      );

      return;
    }


    /* -------------------------------------------------------
       DATE
    ------------------------------------------------------- */

    if (!transactionDate) {

      setSaveError(
        "Please select transaction date."
      );

      return;
    }


    /* -------------------------------------------------------
       SELL VALIDATION
    ------------------------------------------------------- */

    if (
      transactionType ===
      "SELL"
    ) {

      const availableUnits =
        getAvailableUnits();


      if (
        availableUnits <= 0
      ) {

        setSaveError(
          "You do not have any units available to sell."
        );

        return;
      }


      if (
        numericUnits >
        availableUnits
      ) {

        setSaveError(
          `You can sell maximum ${availableUnits} units.`
        );

        return;
      }

    }


    /* -------------------------------------------------------
       SAVE
    ------------------------------------------------------- */

    setSaving(true);


    try {

      const transaction = {

        symbol:
          String(
            asset.symbol
          )
            .trim()
            .toUpperCase()
            .replace(/\.NS$/, ""),

        name:
          asset.name,

        assetType:
          asset.assetType ||
          "STOCK",

        transactionType,

        units:
          numericUnits,

        amount:
          numericAmount,

        transactionDate,

        currentPrice:
          Number(
            asset.price
          ),

      };


      await addTransaction(
        transaction
      );


      /* -----------------------------------------------------
         RESET
      ----------------------------------------------------- */

      setUnits("");

      setAmount("");

      setTransactionType(
        "BUY"
      );

      setTransactionDate(
        getToday()
      );

      setSaveError("");


      /* -----------------------------------------------------
         CLOSE / CALLBACK
      ----------------------------------------------------- */

      if (
        typeof onSaved ===
        "function"
      ) {

        onSaved();

      }

    } catch (error) {

      console.error(
        "Failed to save ETF / Stock transaction:",
        error
      );


      setSaveError(
        error?.message ||
        "Failed to save transaction."
      );

    } finally {

      setSaving(false);
      navigate(-1);
    }
  }


  /* =======================================================
     TRANSACTION PRICE
  ======================================================= */

  const transactionPrice =
    Number(units) > 0 &&
    Number(amount) > 0
      ? Number(amount) /
        Number(units)
      : 0;


  /* =======================================================
     AVAILABLE UNITS
  ======================================================= */

  const availableUnits =
    asset
      ? getAvailableUnits()
      : 0;


  /* =======================================================
     JSX
  ======================================================= */

  return (

    <>


          {/* ===================================================
          TOP HEADER
      =================================================== */}

      <div
        className="
          sticky
          top-0
          z-20
          border-b
          border-slate-800
          bg-slate-950/95
          px-4
          py-2
          backdrop-blur
          sm:px-6
          rounded-3xl
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-3xl
            items-center
            justify-between
            gap-2
          "
        >

          {/* LEFT - BACK */}

          <button
            type="button"
             onClick={() => navigate(-1)}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              text-slate-300
              transition
              hover:border-slate-600
              hover:bg-slate-800
              hover:text-white
            "
            aria-label="Go back"
          >
            <ArrowLeft
              size={19}
            />
          </button>


          {/* CENTER */}

          <div
            className="
              min-w-0
              flex-1
              text-center
            "
          >

            <h1
              className="
                truncate
                text-base
                font-bold
                text-white
                sm:text-lg
              "
            >
              Add Transaction
            </h1>

            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-slate-500
              "
            >
              ETF & Stock Investment
            </p>

          </div>



        </div>

      </div>




      
    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
        my-3
        rounded-3xl
      "
    >




      {/* ===================================================
          FORM CONTENT
      =================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        className="
          mx-auto
          max-w-3xl
          space-y-5
          px-4
          py-5
          sm:px-6
          sm:py-6
        "
      >

        {/* =================================================
            SYMBOL SEARCH
        ================================================= */}

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
            sm:p-5
          "
        >

          <label
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-slate-200
            "
          >
            Stock / ETF Symbol
          </label>


          <div
            className="
              flex
              gap-2
            "
          >

            <input
              type="text"
              value={symbol}
              onChange={(
                event
              ) => {

                if (
                  isFixedSymbol
                ) {
                  return;
                }


                setSymbol(
                  event.target.value
                );

                setAsset(null);

                setSearchError("");

              }}
              onKeyDown={(
                event
              ) => {

                if (
                  event.key ===
                  "Enter"
                ) {

                  event.preventDefault();

                  searchSymbol(
                    symbol
                  );

                }

              }}
              disabled={
                isFixedSymbol
              }
              placeholder="e.g. TCS"
              autoComplete="off"
              className={`
                min-w-0
                flex-1
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                uppercase
                text-white
                outline-none
                placeholder:normal-case
                placeholder:text-slate-600
                focus:border-slate-500
                ${
                  isFixedSymbol
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }
              `}
            />


            {!isFixedSymbol && (
              <button
                type="button"
                onClick={() =>
                  searchSymbol(
                    symbol
                  )
                }
                disabled={
                  searching
                }
                className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-100
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-slate-900
                  transition
                  hover:bg-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {searching ? (
                  <Loader2
                    size={17}
                    className="
                      animate-spin
                    "
                  />
                ) : (
                  <Search
                    size={17}
                  />
                )}

                <span className="hidden sm:inline">
                  Search
                </span>

              </button>
            )}

          </div>


          {isFixedSymbol && (
            <p
              className="
                mt-2
                text-xs
                text-slate-500
              "
            >
              Transaction is being added for this
              selected holding.
            </p>
          )}


          {searchError && (
            <p
              className="
                mt-2
                text-sm
                text-red-400
              "
            >
              {searchError}
            </p>
          )}

        </div>


        {/* =================================================
            ASSET PREVIEW
        ================================================= */}

        {asset && (
          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
              sm:p-5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    truncate
                    text-base
                    font-bold
                    text-white
                  "
                >
                  {asset.name}
                </p>


                <div
                  className="
                    mt-1.5
                    flex
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    {asset.symbol}
                  </span>


                  {asset.assetType && (
                    <span
                      className="
                        rounded-md
                        bg-slate-800
                        px-2
                        py-0.5
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-300
                      "
                    >
                      {asset.assetType}
                    </span>
                  )}

                </div>

              </div>


              <div
                className="
                  shrink-0
                  rounded-xl
                  bg-slate-950
                  px-3
                  py-2
                  text-right
                "
              >

                <p
                  className="
                    text-[10px]
                    font-medium
                    text-slate-500
                  "
                >
                  Current Price
                </p>


                <p
                  className="
                    mt-0.5
                    text-base
                    font-extrabold
                    text-white
                  "
                >
                  {formatCurrency(
                    asset.price
                  )}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* =================================================
            TRANSACTION TYPE
        ================================================= */}

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
            sm:p-5
          "
        >

          <label
            className="
              mb-3
              block
              text-sm
              font-semibold
              text-slate-200
            "
          >
            Transaction Type
          </label>


          <div
            className="
              grid
              grid-cols-2
              gap-2
            "
          >

            <button
              type="button"
              onClick={() =>
                handleTransactionTypeChange(
                  "BUY"
                )
              }
              className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                py-3
                text-sm
                font-bold
                transition
                ${
                  transactionType ===
                  "BUY"
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-950 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }
              `}
            >

              <ShoppingCart
                size={17}
              />

              BUY

            </button>


            <button
              type="button"
              onClick={() =>
                handleTransactionTypeChange(
                  "SELL"
                )
              }
              className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                py-3
                text-sm
                font-bold
                transition
                ${
                  transactionType ===
                  "SELL"
                    ? "border-red-500/60 bg-red-500/10 text-red-400"
                    : "border-slate-700 bg-slate-950 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                }
              `}
            >

              <TrendingDown
                size={17}
              />

              SELL

            </button>

          </div>

        </div>


        {/* =================================================
            UNITS + AMOUNT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          "
        >

          {/* UNITS */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-200
              "
            >
              Units
            </label>


            <input
              type="text"
              inputMode="decimal"
              value={units}
              onChange={(
                event
              ) =>
                handleUnitsChange(
                  event.target.value
                )
              }
              placeholder="e.g. 10.50"
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-slate-600
                focus:border-slate-500
              "
            />


            {transactionType ===
              "SELL" &&
              asset && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-slate-500
                  "
                >
                  Available:{" "}
                  <span
                    className="
                      font-bold
                      text-slate-300
                    "
                  >
                    {availableUnits}
                  </span>
                </p>
              )}

          </div>


          {/* AMOUNT */}

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-4
            "
          >

            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-slate-200
              "
            >

              <IndianRupee
                size={15}
              />

              Total Amount

            </label>


            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(
                event
              ) =>
                handleAmountChange(
                  event.target.value
                )
              }
              placeholder="e.g. 25000"
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                text-white
                outline-none
                placeholder:text-slate-600
                focus:border-slate-500
              "
            />

          </div>

        </div>


        {/* =================================================
            PRICE / UNIT
        ================================================= */}

        {transactionPrice >
          0 && (
          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              px-4
              py-3.5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <span
                className="
                  text-xs
                  font-medium
                  text-slate-500
                "
              >
                Effective Price / Unit
              </span>


              <span
                className="
                  text-sm
                  font-extrabold
                  text-white
                "
              >
                {formatCurrency(
                  transactionPrice
                )}
              </span>

            </div>

          </div>
        )}


        {/* =================================================
            DATE
        ================================================= */}

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
          "
        >

          <label
            className="
              mb-2
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-200
            "
          >

            <CalendarDays
              size={16}
            />

            Transaction Date

          </label>


          <input
            type="date"
            value={
              transactionDate
            }
            onChange={(
              event
            ) =>
              setTransactionDate(
                event.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-950
              px-4
              py-3
              text-sm
              text-white
              outline-none
              focus:border-slate-500
            "
          />

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {saveError && (
          <div
            className="
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              px-4
              py-3
              text-sm
              font-medium
              text-red-400
            "
          >
            {saveError}
          </div>
        )}


        {/* =================================================
            SAVE
        ================================================= */}

        <button
          type="submit"
          disabled={
            saving ||
            searching
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-slate-100
            px-5
            py-3.5
            text-sm
            font-extrabold
            text-slate-900
            shadow-sm
            transition
            hover:bg-white
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {saving ? (
            <>
              <Loader2
                size={18}
                className="
                  animate-spin
                "
              />

              Saving...

            </>
          ) : (
            <>
              {transactionType ===
              "BUY" ? (
                <ShoppingCart
                  size={18}
                />
              ) : (
                <TrendingDown
                  size={18}
                />
              )}

              Save{" "}
              {transactionType}{" "}
              Transaction

            </>
          )}

        </button>

      </form>

    </div>
    </>
  );
}
