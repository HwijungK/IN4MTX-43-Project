import { RootNavigator } from "./src/navigation/RootNavigator";
import { AppProvider } from "./src/state/AppContext";

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
