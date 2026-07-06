import { useState } from "react";
import EmailInput from "./Component/EmailInput";

function App() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="hidden">
        <p>Welcome to Trade Assist! Powered by an Engineering team.</p>
      </div>

      <div className="w-72">
        <EmailInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

    </div>
  );
}

export default App;