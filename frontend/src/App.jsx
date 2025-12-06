import { useTheme } from "./hooks/useTheme";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const { toggleMode } = useTheme();
  return (
    <Provider store={store}>
      <div className="min-h-screen  bg-background text-primary transition-colors duration-300">
        <AppRouter />
      </div>
    </Provider>
  );
};

export default App;
