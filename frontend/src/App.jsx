import { useTheme } from "./hooks/useTheme";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/slices/authSlice";
const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background text-primary transition-colors duration-300">
        <AuthInitializer />
        <AppRouter />
      </div>
    </Provider>
  );
};

export default App;