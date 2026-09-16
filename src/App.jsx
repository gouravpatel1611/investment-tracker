import AppRoutes from "./routes/AppRoutes";

import {
  MutualFundProvider,
} from "./context/MutualFundContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import{
  BondProvider
} from "./context/BondContext";

import {
  IntFdProvider
} from "./context/IntFdContext";
import {
  LicPliProvider
} from "./context/LicPliContext";
import { SGBProvider } from "./context/SGBContext";

import {
  ETFStockProvider,
} from "./context/ETFStockContext";

import { CPFProvider } from "./context/CPFContext";


function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;