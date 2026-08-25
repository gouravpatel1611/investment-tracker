import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

import AddInvestmentModal from "../investments/addInvestment/AddInvestmentModal";

function AppShell() {
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] =
    useState(false);

  /* --------------------------------
     OPEN MODAL
  -------------------------------- */

  const openAddInvestment = () => {
    setIsAddInvestmentOpen(true);
  };

  /* --------------------------------
     CLOSE MODAL
  -------------------------------- */

  const closeAddInvestment = () => {
    setIsAddInvestmentOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <Header />

      {/* MAIN LAYOUT */}
      <div className="mx-auto flex max-w-[1440px]">

        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main
          className="
            min-w-0
            flex-1
            px-4
            pb-28
            pt-5
            sm:px-6
            lg:px-8
            lg:pb-10
            lg:pt-8
          "
        >
          <Outlet
            context={{
              openAddInvestment,
            }}
          />
        </main>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav
        onAdd={openAddInvestment}
      />

      {/* ADD INVESTMENT MODAL */}
      <AddInvestmentModal
        isOpen={isAddInvestmentOpen}
        onClose={closeAddInvestment}
      />

    </div>
  );
}

export default AppShell;