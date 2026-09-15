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


function App() {
  return (
    <AuthProvider>
      <MutualFundProvider>
        <BondProvider>
             <IntFdProvider>
                <LicPliProvider>
                  <AppRoutes />
                </LicPliProvider>
             </IntFdProvider>
        </BondProvider>
      </MutualFundProvider>
    </AuthProvider>
  );
}

export default App;