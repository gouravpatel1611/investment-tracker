
import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  CalendarDays,
  Building2,
  ShieldCheck,
  Percent,
  Hash,
  RotateCcw,
  Save,
  ChevronRight,
  Landmark,
} from "lucide-react";

import { findBondByIsin } from "../../../services/api/bondApi";

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
        <Icon size={14} />
        <span>{label}</span>
      </div>

      <div className="truncate text-sm font-semibold text-slate-100">
        {value || "-"}
      </div>
    </div>
  );
}

export default function BondForm({
  onSubmit,
  onCancel,
  initialData = null,
}) {
  const [isin, setIsin] = useState(initialData?.isin || "");

  const [bondDetails, setBondDetails] = useState(
    initialData || null
  );

  const [purchaseDate, setPurchaseDate] = useState(
    initialData?.purchaseDate || today()
  );

  const [quantity, setQuantity] = useState(
    initialData?.quantity || ""
  );

  const [purchasePrice, setPurchasePrice] = useState(
    initialData?.purchasePrice || ""
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const investedAmount =
    (Number(quantity) || 0) *
    (Number(purchasePrice) || 0);

  useEffect(() => {
    if (initialData) {
      setIsin(initialData.isin || "");
      setBondDetails(initialData);
      setPurchaseDate(
        initialData.purchaseDate || today()
      );
      setQuantity(initialData.quantity || "");
      setPurchasePrice(initialData.purchasePrice || "");
    }
  }, [initialData]);

  const fetchBond = async () => {
    const cleanIsin = isin.trim().toUpperCase();

    setError("");
    setSuccess("");

    if (!cleanIsin) {
      setError("Please enter a valid ISIN.");
      return;
    }

    if (cleanIsin.length !== 12) {
      setError("ISIN must contain 12 characters.");
      return;
    }

    try {
      setLoading(true);

      const data = await findBondByIsin(cleanIsin);

      if (!data) {
        setBondDetails(null);
        setError(
          "Bond not found. Please check the ISIN and try again."
        );
        return;
      }

      setBondDetails(data);
      setSuccess("Bond details fetched successfully.");
    } catch (err) {
      console.error("Bond fetch error:", err);

      setBondDetails(null);

      setError(
        err?.message ||
          "Unable to fetch bond details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!bondDetails) {
      setError("First fetch the bond details using ISIN.");
      return;
    }

    if (!purchaseDate) {
      setError("Please select purchase date.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (
      purchasePrice === "" ||
      Number(purchasePrice) <= 0
    ) {
      setError("Please enter a valid purchase price.");
      return;
    }

    const bondData = {
      ...bondDetails,

      purchaseDate,

      quantity: Number(quantity),

      purchasePrice: Number(purchasePrice),

      investedAmount,
    };

    try {
      setSaving(true);

      await onSubmit?.(bondData);

      setSuccess("Bond details saved successfully.");
    } catch (err) {
      console.error("Bond save error:", err);

      setError(
        err?.message ||
          "Unable to save bond details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setIsin("");
    setBondDetails(null);
    setPurchaseDate(today());
    setQuantity("");
    setPurchasePrice("");
    setError("");
    setSuccess("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-6xl"
    >
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
            <Landmark
              size={22}
              className="text-indigo-400"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Add Bond
            </h1>

            <p className="text-sm text-slate-500">
              Fetch bond details and add your purchase
            </p>
          </div>
        </div>
      </div>

      {/* Main split card */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="grid lg:grid-cols-2">

          {/* LEFT */}
          <div className="border-b border-slate-800 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            {/* Search */}
            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Find Your Bond
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter the 12-character ISIN
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">
                  ISIN
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Hash
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={isin}
                    onChange={(e) =>
                      setIsin(
                        e.target.value
                          .toUpperCase()
                          .replace(/\s/g, "")
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        fetchBond();
                      }
                    }}
                    maxLength={12}
                    placeholder="INE000A00000"
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm font-medium tracking-wide text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchBond}
                  disabled={loading}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Fetching
                    </>
                  ) : (
                    <>
                      <Search size={17} />
                      Fetch
                    </>
                  )}
                </button>
              </div>

              {/* Status */}
              {error && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {success && !error && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}
            </div>

            {/* Bond Details */}
            {bondDetails ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Bond Information
                    </p>

                    <h2 className="mt-1 line-clamp-2 text-base font-bold text-white">
                      {bondDetails.bondName}
                    </h2>
                  </div>

                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InfoItem
                    icon={Hash}
                    label="ISIN"
                    value={bondDetails.isin}
                  />

                  <InfoItem
                    icon={Building2}
                    label="Issuer"
                    value={bondDetails.issuer}
                  />

                  <InfoItem
                    icon={Landmark}
                    label="Bond Type"
                    value={bondDetails.bondType}
                  />

                  <InfoItem
                    icon={IndianRupee}
                    label="Face Value"
                    value={
                      bondDetails.faceValue
                        ? formatCurrency(
                            bondDetails.faceValue
                          )
                        : "-"
                    }
                  />

                  <InfoItem
                    icon={Percent}
                    label="Coupon Rate"
                    value={
                      bondDetails.couponRate != null
                        ? `${bondDetails.couponRate}%`
                        : "-"
                    }
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Frequency"
                    value={
                      bondDetails.couponFrequency
                    }
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Issue Date"
                    value={formatDate(
                      bondDetails.issueDate
                    )}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Maturity"
                    value={formatDate(
                      bondDetails.maturityDate
                    )}
                  />
                </div>

                {bondDetails.rating && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        size={17}
                        className="text-amber-400"
                      />

                      <span className="text-sm text-slate-400">
                        Credit Rating
                      </span>
                    </div>

                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-bold text-white">
                      {bondDetails.rating}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-6 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
                    <Search
                      size={23}
                      className="text-slate-600"
                    />
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    No Bond Selected
                  </p>

                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-600">
                    Enter an ISIN above and fetch the bond
                    details to continue.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                  <IndianRupee
                    size={16}
                    className="text-indigo-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Purchase Details
                  </p>

                  <p className="text-xs text-slate-500">
                    Enter your actual purchase information
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Purchase Date */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Purchase Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) =>
                      setPurchaseDate(e.target.value)
                    }
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Quantity / Bonds
                </label>

                <div className="relative">
                  <Hash
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value)
                    }
                    placeholder="e.g. 10"
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Purchase Price */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Purchase Price / Bond
                </label>

                <div className="relative">
                  <IndianRupee
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) =>
                      setPurchasePrice(e.target.value)
                    }
                    placeholder="e.g. 985.50"
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-600">
                  Enter the price actually paid per bond.
                </p>
              </div>

              {/* Invested Amount */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Total Invested Amount
                    </span>

                    <IndianRupee
                      size={17}
                      className="text-indigo-400"
                    />
                  </div>

                  <div className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {formatCurrency(investedAmount)}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>
                      {Number(quantity) || 0} bonds
                    </span>

                    <ChevronRight size={12} />

                    <span>
                      {formatCurrency(
                        Number(purchasePrice) || 0
                      )} each
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex gap-2">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />

                  <p className="text-[11px] leading-5 text-slate-500">
                    Coupon interest, accrued interest,
                    current value and profit/loss can be
                    calculated after the bond is saved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-800 bg-slate-900/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <button
            type="button"
            onClick={handleReset}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-800 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={
                saving ||
                !bondDetails ||
                !quantity ||
                !purchasePrice
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Bond
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

