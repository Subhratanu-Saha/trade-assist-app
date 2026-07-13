import React from 'react';
import EmailInput from '../Component/EmailInput';
import PasswordInput from './auth/passwordInput';
import Button from './Button';

function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-2xl font-semibold text-slate-800">Login</h2>

      <EmailInput />
      <PasswordInput />

      <div className="mt-6">
        <Button label="Login" type="submit" />
      </div>
    </div>
  );
}

export default LoginForm;
