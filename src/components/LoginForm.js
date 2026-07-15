import EmailInput from "../Component/EmailInput";
import PasswordInput from "./auth/passwordInput";
import Button from "./Button";
function LoginForm() {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-slate-900 shadow-2xl py-8 px-4">
      <style>{`
        .login-form-inputs > div {
          width: 100% !important;
          max-width: 20rem !important;
        }
      `}</style>
      <div className="flex justify-center">
        <div className="bg-white rounded-3xl shadow-lg w-full px-6 py-8">
          <h2 className="text-2xl font-semibold text-center text-slate-900">
            LOGIN FORM
          </h2>
          <b>
          <p className="text-center text-gray-500 font-medium mt-3 mb-8">
            LogIn to continue with Trade Assist
          </p>
          </b>
          <form className="space-y-5 mx-auto w-full login-form-inputs">
            <EmailInput />
            <PasswordInput />
            <Button label="Login" type="submit" />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" className="text-blue-600 hover:underline">Forgot?</button>
              </div>
            </div>
            <div className="text-center text-sm text-slate-500 mt-4">
              Don't have an account? <button type="button" className="text-blue-600 hover:underline">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;