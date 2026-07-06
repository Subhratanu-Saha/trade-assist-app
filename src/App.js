import { useState } from "react";
import PasswordInput from "./components/auth/passwordInput";

function App() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    const validationError = validatePassword(value);
    setError(validationError);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <PasswordInput
          value={password}
          onChange={handlePasswordChange}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;