import { useTheme } from "./hooks/useTheme";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

        {/* ✅ ToastContainer should be self-closing and inside Provider */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </Provider>
  );
};

export default App;