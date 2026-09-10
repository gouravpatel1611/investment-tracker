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

function App() {
  return (
    <AuthProvider>
      <MutualFundProvider>
        <BondProvider>
          <AppRoutes />
        </BondProvider>
      </MutualFundProvider>
    </AuthProvider>
  );
}

export default App;