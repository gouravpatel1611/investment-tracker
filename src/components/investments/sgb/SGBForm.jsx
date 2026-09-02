import { useState } from "react";
import { Save, X } from "lucide-react";

import SGBSeriesSearch from "./SGBSeriesSearch";
import { findSGBBySeriesCode } from "../../../services/api/sgbService";

const SGBForm = ({ onCancel, onSave }) => {
  const [seriesCode, setSeriesCode] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);

  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);

  const [units, setUnits] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");

  const purchaseValue =
    units && purchaseRate
      ? Number(units) * Number(purchaseRate)
      : 0;

  const handleSeriesCodeChange = (value) => {
    setSeriesCode(value.toUpperCase());

    // Code change karte hi purani search details hata do
    setSelectedSeries(null);
    setSearchError("");
  };

  const handleSearch = async () => {
    setSearchError("");
    setSelectedSeries(null);

    if (!seriesCode.trim()) {
      setSearchError("Please enter SGB Series Code");
      return;
    }

    try {
      setLoading(true);

      const result = await findSGBBySeriesCode(seriesCode);

      setSelectedSeries(result);
    } catch (error) {
      setSearchError(
        error.message || "SGB Series Code not found"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchError("");

    if (!selectedSeries) {
      setSearchError(
        "Please search and select a valid SGB Series Code"
      );
      return;
    }

    if (!units || Number(units) <= 0) {
      setSearchError("Please enter valid Units / Gram");
      return;
    }

    if (!purchaseRate || Number(purchaseRate) <= 0) {
      setSearchError("Please enter valid Purchase Rate");
      return;
    }

    const sgbData = {
      seriesCode: selectedSeries.seriesCode,
      seriesName: selectedSeries.seriesName,
      isin: selectedSeries.isin,

      issueDate: selectedSeries.issueDate,
      maturityDate: selectedSeries.maturityDate,

      issuePrice: selectedSeries.issuePrice,
      interestRate: selectedSeries.interestRate,
      interestFrequency: selectedSeries.interestFrequency,
      denomination: selectedSeries.denomination,
      issuer: selectedSeries.issuer,

      units: Number(units),
      purchaseRate: Number(purchaseRate),
      purchaseValue,
    };

    if (onSave) {
      onSave(sgbData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 "
    >
      {/* SGB Series Search */}
      <SGBSeriesSearch
        seriesCode={seriesCode}
        setSeriesCode={handleSeriesCodeChange}
        onSearch={handleSearch}
        loading={loading}
        error={searchError}
        selectedSeries={selectedSeries}
      />

      {/* Investment Details */}
      {selectedSeries && (
        <div className="space-y-5">
          {/* Heading */}
          <div>
            <h3 className="text-base font-semibold text-gray-200">
              Your Investment
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Enter your SGB quantity and purchase rate.
            </p>
          </div>

          {/* Units */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Units / Gram
            </label>

            <input
              type="number"
              min="1"
              step="1"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-500"
            />
          </div>

          {/* Purchase Rate */}
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
                  setPurchaseRate(e.target.value)
                }
                placeholder="e.g. 12000"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-9 pr-4 text-sm text-white outline-none transition focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Purchase Value */}
          <div className="rounded-2xl border border-gray-700 bg-gray-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-400">
                Purchase Value
              </span>

              <span className="text-lg font-bold text-gray-100">
                ₹{purchaseValue.toLocaleString("en-IN")}
              </span>
            </div>

            {units && purchaseRate && (
              <p className="mt-2 text-xs text-gray-500">
                {units} Gram × ₹
                {Number(purchaseRate).toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
            >
              <Save size={18} />
              Save SGB
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SGBForm;