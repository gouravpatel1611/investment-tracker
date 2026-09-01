import AppRoutes from "./routes/AppRoutes";

import {
  MutualFundProvider,
} from "./context/MutualFundContext";

import {
  AuthProvider,
} from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <MutualFundProvider>
        <AppRoutes />
      </MutualFundProvider>
    </AuthProvider>
  );
}

export default App;