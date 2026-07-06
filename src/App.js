import { useState } from "react";
import PasswordInput from "./components/auth/passwordInput";

function App() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = () => {
    // Check if password is empty
    if (!password.trim()) {
      setError("Password field cannot be empty");
      return false;
    }

    // Check for at least one special character
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharPattern.test(password)) {
      setError("Password must contain at least one special character");
      return false;
    }

    setError("");
    return true;
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <header className="w-full max-w-xl rounded-2xl bg-slate-800 px-8 py-10 text-center text-white shadow-xl">
        <PasswordInput
          value={password}
          onChange={handlePasswordChange}
          error={error}
        />
      </header>
    </div>
  );
}

export default App;
