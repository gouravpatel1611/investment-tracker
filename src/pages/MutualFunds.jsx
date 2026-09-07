import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestorFilter from "../components/investments/mutualFunds/InvestorFilter";
import MutualFundSummaryCard from "../components/investments/mutualFunds/MutualFundSummaryCard";
import MutualFundCard from "../components/investments/mutualFunds/MutualFundCard";

import {
  useMutualFunds,
} from "../context/MutualFundContext";

function MutualFunds() {
  const navigate = useNavigate();

  const {
    holdings,
    loading,
    error,
  } = useMutualFunds();

  const [
    selectedInvestor,
    setSelectedInvestor,
  ] = useState("all");

  /* --------------------------------
     INVESTORS
  -------------------------------- */

  const investors = useMemo(() => {

    const unique =
      new Map();

    holdings.forEach((fund) => {

      if (
        !fund.investorId
      ) {
        return;
      }

      if (
        !unique.has(
          fund.investorId
        )
      ) {
        unique.set(
          fund.investorId,
          {
            id:
              fund.investorId,

            name:
              fund.investorName ||
              "Investor",
          }
        );
      }
    });

    return Array.from(
      unique.values()
    );

  }, [holdings]);

  /* --------------------------------
     FILTER
  -------------------------------- */

  const filteredFunds =
    useMemo(() => {

      if (
        selectedInvestor ===
        "all"
      ) {
        return holdings;
      }

      return holdings.filter(
        (fund) =>
          fund.investorId ===
          selectedInvestor
      );

    }, [
      holdings,
      selectedInvestor,
    ]);

  /* --------------------------------
     SUMMARY
  -------------------------------- */

  const summary =
    useMemo(() => {

      return filteredFunds.reduce(
        (total, fund) => {

          total.invested +=
            Number(
              fund.investedAmount
            ) || 0;

          total.currentValue +=
            Number(
              fund.currentValue
            ) || 0;

          total.profitLoss +=
            Number(
              fund.profitLoss
            ) || 0;

          total.units +=
            Number(
              fund.units
            ) || 0;

          return total;
        },
        {
          invested: 0,
          currentValue: 0,
          profitLoss: 0,
          units: 0,
        }
      );

    }, [filteredFunds]);

  const returnPercent =
    summary.invested > 0
      ? (
          summary.profitLoss /
          summary.invested
        ) * 100
      : 0;

  /* --------------------------------
     LOADING
  -------------------------------- */

  if (loading) {
    return (
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Mutual Funds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Loading your investments...
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-700
            bg-slate-900
            p-8
            text-center
          "
        >
          <p className="text-sm font-semibold text-slate-300">
            Loading mutual funds...
          </p>
        </div>

      </div>
    );
  }

  /* --------------------------------
     ERROR
  -------------------------------- */

  if (error) {
    return (
      <div className="space-y-5">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Mutual Funds
          </h1>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            p-5
          "
        >
          <p className="text-sm font-semibold text-red-400">
            {error}
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1 className="text-2xl font-extrabold text-dark">
            Mutual Funds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Track and manage your mutual fund investments
          </p>

        </div>

        <div
          className="
            flex
            w-full
            items-center
            gap-2
            sm:w-auto
          "
        >

          <div className="flex-1 sm:flex-none">

            <InvestorFilter
              investors={investors}
              selectedInvestor={
                selectedInvestor
              }
              onChange={
                setSelectedInvestor
              }
            />

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/portfolio/mutual-funds/add"
              )
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-900
              text-white
              shadow-sm
              transition
              hover:bg-slate-800
              active:scale-95
            "
            aria-label="Add Mutual Fund"
          >
            <Plus size={19} />
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <MutualFundSummaryCard
        data={{
          invested:
            summary.invested,

          currentValue:
            summary.currentValue,

          profitLoss:
            summary.profitLoss,

          returnPercent,

          holdings:
            filteredFunds.length,

          units:
            summary.units,
        }}
      />

      {/* HOLDINGS */}

      <div className="space-y-3">

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2 className="text-base font-bold text-dark">
            Your Mutual Funds
          </h2>

          <span className="text-xs font-medium text-slate-400">
            {filteredFunds.length}{" "}
            {filteredFunds.length === 1
              ? "Fund"
              : "Funds"}
          </span>

        </div>

        {filteredFunds.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              p-8
              text-center
            "
          >

            <p className="text-sm font-semibold text-slate-200">
              No mutual funds found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add your first mutual fund investment.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              gap-3
              lg:grid-cols-2
            "
          >

            {[...filteredFunds]
              .sort((a, b) =>
                a.schemeName.localeCompare(b.schemeName)
              )
              .map((fund) => (
                <MutualFundCard
                  key={fund.id}
                  fund={fund}
                />
              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MutualFunds;