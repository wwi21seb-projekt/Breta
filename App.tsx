import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./authentification/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;

