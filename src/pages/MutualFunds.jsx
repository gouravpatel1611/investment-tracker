import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvestorFilter from "../components/investments/mutualFunds/InvestorFilter";
import MutualFundSummaryCard from "../components/investments/mutualFunds/MutualFundSummaryCard";


const investors = [
  {
    id: "investor1",
    name: "Gourav",
    mutualFunds: {
      invested: 150000,
      currentValue: 172500,
      holdings: 4,
    },
  },
  {
    id: "investor2",
    name: "Investor 2",
    mutualFunds: {
      invested: 100000,
      currentValue: 108000,
      holdings: 3,
    },
  },
  {
    id: "investor3",
    name: "Investor 3",
    mutualFunds: {
      invested: 75000,
      currentValue: 82500,
      holdings: 2,
    },
  },
];

function MutualFunds() {
  const navigate = useNavigate();

  const [selectedInvestor, setSelectedInvestor] =
    useState("all");

  const summary = useMemo(() => {
    if (selectedInvestor === "all") {
      return investors.reduce(
        (total, investor) => {
          total.invested +=
            investor.mutualFunds.invested;

          total.currentValue +=
            investor.mutualFunds.currentValue;

          total.holdings +=
            investor.mutualFunds.holdings;

          return total;
        },
        {
          invested: 0,
          currentValue: 0,
          holdings: 0,
        }
      );
    }

    const investor = investors.find(
      (item) => item.id === selectedInvestor
    );

    if (!investor) {
      return {
        invested: 0,
        currentValue: 0,
        holdings: 0,
      };
    }

    return investor.mutualFunds;
  }, [selectedInvestor]);

  const profitLoss =
    summary.currentValue - summary.invested;

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Mutual Funds
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Track and manage your mutual fund investments
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

          {/* INVESTOR FILTER */}
          <InvestorFilter
            investors={investors}
            selectedInvestor={selectedInvestor}
            onChange={setSelectedInvestor}
          />



        </div>
      </div>

      {/* SUMMARY CARD */}
      <MutualFundSummaryCard
        data={{
          invested: summary.invested,
          currentValue: summary.currentValue,
          profitLoss,
          holdings: summary.holdings,
        }}
      />

    </div>
  );
}

export default MutualFunds;