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



function App() {
  return (
    <AuthProvider>
      <MutualFundProvider>
        <BondProvider>
             <IntFdProvider>
                <LicPliProvider>
                    <SGBProvider>
                      <ETFStockProvider>
                        <AppRoutes />
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