
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppShell from "../components/layout/AppShell";

import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import Transactions from "../pages/Transactions";
import Settings from "../pages/Settings";

import MutualFunds from "../pages/MutualFunds";
import MutualFundForm from "../components/investments/mutualFunds/MutualFundForm";
import MutualFundDetails from "../pages/MutualFundDetails";

import Login from "../pages/Login";

import SGB from "../pages/investments/SGB";
import AddSGB from "../pages/investments/AddSGB";

import AddBond from "../pages/bonds/AddBond";
import Bonds from "../pages/bonds/Bonds";
import BondDetails from "../pages/bonds/BondDetails";

import Migration from "../pages/Migration";

// CPF
import CPF from "../pages/cpf/CPF";

import IntFd from "../pages/intFd/IntFd";
import IntFdForm from "../pages/intFd/IntFdForm";

import LicPli from "../pages/licPli/LicPli";
import LicPliForm from "../pages/licPli/LicPliForm";

// ETF / Stock
import ETFStock from "../pages/etfStock/ETFStock";
import ETFStockDetails from "../pages/etfStock/ETFStockDetails";
import ETFStockTransactionForm from "../components/etfStock/ETFStockTransactionForm"
import Investors from "../pages/investors/Investors";
import Vortaxa from "../pages/vortaxa/Vortaxa";
import AddVortaxa from "../pages/vortaxa/AddVortaxa";
import VortaxaDetails from "../pages/vortaxa/VortaxaDetails";
import VortaxaTransactions from "../pages/vortaxa/VortaxaTransactions";
import VortaxaRates from "../pages/vortaxa/VortaxaRates";





import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Protected App */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppShell />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/migration"
              element={<Migration />}
            />

            <Route
              path="/portfolio"
              element={<Portfolio />}
            />

            {/* -----------------------------
                MUTUAL FUNDS
            ----------------------------- */}

            <Route
              path="/mutual-funds"
              element={<MutualFunds />}
            />

            <Route
              path="/portfolio/mutual-funds/:fundId"
              element={<MutualFundDetails />}
            />

            <Route
              path="/mutual-funds/add"
              element={<MutualFundForm />}
            />

            {/* -----------------------------
                ETF / STOCK
            ----------------------------- */}

            <Route
              path="/etf-stock"
              element={<ETFStock />}
            />

            <Route
              path="/etf-stock/:symbol"
              element={<ETFStockDetails />}
            />
            <Route
              path="/etf-stock/add"
              element={<ETFStockTransactionForm />}
            />


            {/* -----------------------------
                TRANSACTIONS
            ----------------------------- */}

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* -----------------------------
                SGB
            ----------------------------- */}

            <Route
              path="/sgb"
              element={<SGB />}
            />

            <Route
              path="/sgb/add"
              element={<AddSGB />}
            />

            {/* -----------------------------
                BONDS
            ----------------------------- */}

            <Route
              path="/bonds/add"
              element={<AddBond />}
            />

            <Route
              path="/bonds"
              element={<Bonds />}
            />

            <Route
              path="/bonds/:id"
              element={<BondDetails />}
            />

            {/* -----------------------------
                CPF
            ----------------------------- */}

            <Route
              path="/cpf"
              element={<CPF />}
            />

            {/* -----------------------------
                INT / FD
            ----------------------------- */}

            <Route
              path="/int-fd"
              element={<IntFd />}
            />

            <Route
              path="/int-fd/add"
              element={<IntFdForm />}
            />

            <Route
              path="/int-fd/edit/:fdId"
              element={<IntFdForm />}
            />

            {/* -----------------------------
                LIC / PLI
            ----------------------------- */}

            <Route
              path="/lic-pli"
              element={<LicPli />}
            />

            <Route
              path="/lic-pli/add"
              element={<LicPliForm />}
            />

            <Route
              path="/lic-pli/edit/:id"
              element={<LicPliForm />}
            />

            <Route
              path="/investors"
              element={<Investors />}
            />

            

            {/* vortaxa  */}

            <Route
              path="/vortaxa"
              element={
                <Vortaxa />
              }
            />


            <Route
              path="/vortaxa/add"
              element={
                <AddVortaxa />
              }
            />

            <Route
              path="/vortaxa/:investorId/transactions"
              element={<VortaxaTransactions />}
            />


            <Route
              path="/vortaxa/:investorId"
              element={<VortaxaDetails />}
            />

            <Route
              path="/vortaxa/:investorId/rates"
              element={<VortaxaRates />}
            />
                        












            {/* -----------------------------
                FALLBACK
            ----------------------------- */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Route>

        </Route>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

