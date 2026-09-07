import { useState } from "react";
import {
  Save,
  X,
} from "lucide-react";

import SGBSeriesSearch from "./SGBSeriesSearch";

import {
  findSGBBySeriesCode,
} from "../../../services/api/sgbService";

const SGBForm = ({
  onCancel,
  onSave,
  saving = false,
}) => {

  // ==========================================
  // SGB SERIES
  // ==========================================

  const [seriesCode, setSeriesCode] =
    useState("");

  const [selectedSeries, setSelectedSeries] =
    useState(null);

  const [searchError, setSearchError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // INVESTMENT DETAILS
  // ==========================================

  const [issueDate, setIssueDate] =
    useState("");

  const [units, setUnits] =
    useState("");

  const [purchaseRate, setPurchaseRate] =
    useState("");

  // ==========================================
  // MATURITY DATE
  // Issue Date + 8 Years
  // ==========================================

  const calculateMaturityDate = (date) => {

    if (!date) {
      return "";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return "";
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);

    if (
      !year ||
      !month ||
      !day
    ) {
      return "";
    }

    /*
      String based calculation se timezone
      problem avoid hota hai.
    */

    return `${year + 8}-${String(
      month
    ).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const maturityDate =
    calculateMaturityDate(issueDate);

  // ==========================================
  // PURCHASE VALUE
  // ==========================================

  const purchaseValue =
    units && purchaseRate
      ? Number(units) *
        Number(purchaseRate)
      : 0;

  // ==========================================
  // SERIES CODE CHANGE
  // ==========================================

  const handleSeriesCodeChange = (
    value
  ) => {

    const normalizedValue =
      value.toUpperCase();

    setSeriesCode(
      normalizedValue
    );

    /*
      Purani search details clear
    */

    setSelectedSeries(null);
    setSearchError("");

    /*
      Issue date bhi clear
    */

    setIssueDate("");
  };

  // ==========================================
  // SEARCH SGB
  // ==========================================

  const handleSearch = async () => {

    setSearchError("");
    setSelectedSeries(null);
    setIssueDate("");

    if (!seriesCode.trim()) {

      setSearchError(
        "Please enter SGB Series Code"
      );

      return;
    }

    try {

      setLoading(true);

      const result =
        await findSGBBySeriesCode(
          seriesCode
        );

      setSelectedSeries(result);

    } catch (error) {

      setSearchError(
        error?.message ||
          "SGB Series Code not found"
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSearchError("");

    // ------------------------------------------
    // ALREADY SAVING
    // ------------------------------------------

    if (saving) {
      return;
    }

    // ------------------------------------------
    // SERIES VALIDATION
    // ------------------------------------------

    if (!selectedSeries) {

      setSearchError(
        "Please search and select a valid SGB Series Code"
      );

      return;
    }

    // ------------------------------------------
    // ISSUE DATE VALIDATION
    // ------------------------------------------

    if (!issueDate) {

      setSearchError(
        "Please select Issue Date"
      );

      return;
    }

    // ------------------------------------------
    // UNITS VALIDATION
    // ------------------------------------------

    if (
      !units ||
      Number(units) <= 0
    ) {

      setSearchError(
        "Please enter valid Units / Gram"
      );

      return;
    }

    // ------------------------------------------
    // PURCHASE RATE VALIDATION
    // ------------------------------------------

    if (
      !purchaseRate ||
      Number(purchaseRate) <= 0
    ) {

      setSearchError(
        "Please enter valid Purchase Rate"
      );

      return;
    }

    // ------------------------------------------
    // MATURITY DATE
    // ------------------------------------------

    if (!maturityDate) {

      setSearchError(
        "Unable to calculate maturity date"
      );

      return;
    }

    // ------------------------------------------
    // FINAL SGB DATA
    // ------------------------------------------

    const sgbData = {

      /*
        SGB API data
      */

      seriesCode:
        selectedSeries.seriesCode,

      issuePrice:
        Number(
          selectedSeries.issuePrice || 0
        ),

      /*
        User entered data
      */

      issueDate,

      maturityDate,

      units:
        Number(units),

      purchaseRate:
        Number(purchaseRate),

      purchaseValue:
        Number(purchaseValue),
    };

    console.log(
      "SGB DATA:",
      sgbData
    );

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    if (onSave) {

      try {

        await onSave(sgbData);

      } catch (error) {

        console.error(
          "SGB form save error:",
          error
        );

      }
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ======================================
          SGB SERIES SEARCH + FOUND CARD
      ======================================= */}

      <SGBSeriesSearch
        seriesCode={seriesCode}
        setSeriesCode={
          handleSeriesCodeChange
        }
        onSearch={handleSearch}
        loading={loading}
        error={searchError}
        selectedSeries={
          selectedSeries
        }
        issueDate={issueDate}
        maturityDate={
          maturityDate
        }
        setIssueDate={
          setIssueDate
        }
      />

      {/* ======================================
          INVESTMENT DETAILS
      ======================================= */}

      {selectedSeries && (
        <div className="space-y-5">

          {/* ==================================
              HEADING
          =================================== */}

          <div>
            <h3 className="text-base font-semibold text-gray-200">
              Your Investment
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Enter your SGB quantity and purchase rate.
            </p>
          </div>

          {/* ==================================
              UNITS
          =================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Units / Gram
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={units}
              onChange={(e) =>
                setUnits(
                  e.target.value
                )
              }
              placeholder="e.g. 10"
              disabled={saving}
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

          </div>

          {/* ==================================
              PURCHASE RATE
          =================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Purchase Rate
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={purchaseRate}
                onChange={(e) =>
                  setPurchaseRate(
                    e.target.value
                  )
                }
                placeholder="e.g. 12000"
                disabled={saving}
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-9 pr-4 text-sm text-white outline-none transition focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>

          </div>

          {/* ==================================
              PURCHASE VALUE
          =================================== */}

          <div className="rounded-2xl border border-gray-700 bg-gray-950 p-4">

            <div className="flex items-center justify-between gap-4">

              <span className="text-sm text-gray-400">
                Purchase Value
              </span>

              <span className="text-lg font-bold text-gray-100">
                ₹
                {purchaseValue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            {units &&
              purchaseRate && (
                <p className="mt-2 text-xs text-gray-500">

                  {units} Gram × ₹
                  {Number(
                    purchaseRate
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}

                </p>
              )}

          </div>

          {/* ==================================
              ERROR
          =================================== */}

          {searchError && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {searchError}
            </div>
          )}

          {/* ==================================
              BUTTONS
          =================================== */}

          <div className="flex gap-3 pt-2">

            {/* --------------------------------
                CANCEL
            --------------------------------- */}

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <X size={18} />

              Cancel

            </button>

            {/* --------------------------------
                SAVE
            --------------------------------- */}

            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save SGB"}

            </button>

          </div>

        </div>
      )}

    </form>
  );
};

export default SGBForm;