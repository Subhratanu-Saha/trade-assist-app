import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-2xl bg-slate-800 px-8 py-10 text-white shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-xl font-semibold">
      
          </p>
        </div>

        <div className="flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default App;