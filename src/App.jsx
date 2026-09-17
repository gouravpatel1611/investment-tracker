import AppRoutes from "./routes/AppRoutes";

import {
  MutualFundProvider,
} from "./context/MutualFundContext";

import {
  InvestorProvider,
} from "./context/InvestorContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  BondProvider,
} from "./context/BondContext";

import {
  IntFdProvider,
} from "./context/IntFdContext";

import {
  LicPliProvider,
} from "./context/LicPliContext";

import {
  SGBProvider,
} from "./context/SGBContext";

import {
  ETFStockProvider,
} from "./context/ETFStockContext";

import {
  CPFProvider,
} from "./context/CPFContext";


function App() {
  return (
    <AuthProvider>
      <InvestorProvider>
        <MutualFundProvider>
          <BondProvider>
            <IntFdProvider>
              <LicPliProvider>
                <SGBProvider>
                  <ETFStockProvider>
                    <CPFProvider>
                      <AppRoutes />
                    </CPFProvider>
                  </ETFStockProvider>
                </SGBProvider>
              </LicPliProvider>
            </IntFdProvider>
          </BondProvider>
        </MutualFundProvider>
      </InvestorProvider>
    </AuthProvider>
  );
}

export default App;