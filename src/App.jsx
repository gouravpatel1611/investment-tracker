import AppRoutes from "./routes/AppRoutes";
import {
  MutualFundProvider,
} from "./context/MutualFundContext";

function App() {
  return (
    <MutualFundProvider>
      <AppRoutes />
    </MutualFundProvider>
  );
}

export default App;