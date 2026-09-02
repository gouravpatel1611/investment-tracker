import {
  ChevronRight,
  Plus,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

import PortfolioSummary from "../components/dashboard/PortfolioSummary";
import AssetAllocation from "../components/dashboard/AssetAllocation";
import AssetBreakdown from "../components/dashboard/AssetBreakdown";

import SectionHeader from "../components/common/SectionHeader";

function Dashboard() {
  const { openAddInvestment } = useOutletContext();

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            Good afternoon
          </p>

          <h1 className="page-title mt-1">
            Your portfolio
          </h1>
        </div>

        {/* DESKTOP ADD INVESTMENT */}
        <button
          type="button"
          onClick={openAddInvestment}
          className="
            hidden
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-slate-800
            active:scale-[0.98]
            sm:flex
          "
        >
          <Plus size={17} />
          Add investment
        </button>

      </section>


      {/* PORTFOLIO SUMMARY */}
      <PortfolioSummary />


      {/* ASSET BREAKDOWN */}
      <section>

        <SectionHeader
          title="Asset breakdown"
          subtitle="Your investments by asset class"
        />

        <div className="mt-4">
          <AssetBreakdown />
        </div>

      </section>


      {/* ASSET ALLOCATION */}
      <section className="surface p-4 sm:p-5">

        <SectionHeader
          title="Asset allocation"
          subtitle="Current portfolio mix"
        />

        <div className="mt-5">
          <AssetAllocation />
        </div>

      </section>


     

    </div>
  );
}

export default Dashboard;