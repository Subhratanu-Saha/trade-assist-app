import EmailInput from "./auth/EmailInput";
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
          <form className="space-y-5 mx-auto w-full login-form-inputs">
            <EmailInput />
            <PasswordInput />
            <Button label="Login" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginForm;