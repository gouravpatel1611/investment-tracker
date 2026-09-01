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

import Migration from "../pages/Migration";

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

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

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

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;