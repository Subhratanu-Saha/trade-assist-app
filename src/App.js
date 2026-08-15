import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import PrivateRoute from "./components/search/PrivateRoute";
import SearchPage from "./components/pages/SearchPage";
import { isUserAuthenticated } from "./utils/sessionStorage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isUserAuthenticated() ? (
            <Navigate to="/search" replace />
          ) : (
            <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center px-4 py-4">
              <div className="w-full max-w-md mx-auto bg-slate-900 rounded-3xl shadow-2xl py-8 px-5">
                <LoginForm />
              </div>
            </div>
          )
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <SearchPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;