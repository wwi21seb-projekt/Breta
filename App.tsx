import { createStackNavigator } from "@react-navigation/stack";
import AppNavigator from "./navigation/AppNavigator";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AppNavigator></AppNavigator>
  );
};

export default App;
