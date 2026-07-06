import { useState } from "react";
import "./App.css";
import PasswordInput from "./components/auth/passwordInput";

function App() {
  // State to store password
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to Trade Assist! Powered by an Engineering team.</p>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </header>
    </div>
  );
}

export default App;