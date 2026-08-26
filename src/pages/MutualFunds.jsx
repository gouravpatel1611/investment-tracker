import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestorFilter from "../components/investments/mutualFunds/InvestorFilter";
import MutualFundSummaryCard from "../components/investments/mutualFunds/MutualFundSummaryCard";
import MutualFundCard from "../components/investments/mutualFunds/MutualFundCard";

import mutualFundDummyData from "../data/mutualFunds/mutualFundDummyData";

function MutualFunds() {
  const navigate = useNavigate();

  const [selectedInvestor, setSelectedInvestor] =
    useState("all");

  /*
   * --------------------------------
   * INVESTORS
   * --------------------------------
   * Abhi investors bhi dummy fund data
   * se automatically generate honge.
   */
  const investors = useMemo(() => {
    const uniqueInvestors = new Map();

    mutualFundDummyData.forEach((fund) => {
      if (!uniqueInvestors.has(fund.investorId)) {
        uniqueInvestors.set(fund.investorId, {
          id: fund.investorId,
          name: fund.investorName,
        });
      }
    });

    return Array.from(uniqueInvestors.values());
  }, []);

  /*
   * --------------------------------
   * FILTERED FUNDS
   * --------------------------------
   */
  const filteredFunds = useMemo(() => {
    if (selectedInvestor === "all") {
      return mutualFundDummyData;
    }

    return mutualFundDummyData.filter(
      (fund) =>
        fund.investorId === selectedInvestor
    );
  }, [selectedInvestor]);

  /*
   * --------------------------------
   * SUMMARY
   * --------------------------------
   * Summary directly cards ke data se
   * calculate ho rahi hai.
   */
  const summary = useMemo(() => {
    return filteredFunds.reduce(
      (total, fund) => {
        total.invested +=
          Number(fund.investedAmount) || 0;

        total.currentValue +=
          Number(fund.currentValue) || 0;

        total.profitLoss +=
          Number(fund.profitLoss) || 0;

        total.units +=
          Number(fund.units) || 0;

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

  /*
   * Overall return %
   */
  const returnPercent =
    summary.invested > 0
      ? (summary.profitLoss /
          summary.invested) *
        100
      : 0;

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Mutual Funds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Track and manage your mutual fund investments
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">

          {/* INVESTOR FILTER */}
          <div className="flex-1 sm:flex-none">
            <InvestorFilter
              investors={investors}
              selectedInvestor={selectedInvestor}
              onChange={setSelectedInvestor}
            />
          </div>

          {/* ADD MUTUAL FUND */}
          <button
            type="button"
            onClick={() =>
              navigate("/portfolio/mutual-funds/add")
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

      {/* SUMMARY CARD */}
      <MutualFundSummaryCard
        data={{
          invested: summary.invested,
          currentValue: summary.currentValue,
          profitLoss: summary.profitLoss,
          returnPercent,
          holdings: filteredFunds.length,
          units: summary.units,
        }}
      />

      {/* MUTUAL FUND HOLDINGS */}
      <div className="space-y-3">

        <div className="flex items-center justify-between">

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

        {/* FUND CARDS */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

          {filteredFunds.map((fund) => (
            <MutualFundCard
              key={fund.id}
              fund={fund}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default MutualFunds;