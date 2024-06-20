import * as React from "react";
import { FirebaseError } from "@firebase/util";

export interface PasswordFormValue {
  email: string;
  password: string;
}

interface PasswordFormProps extends Omit<JSX.IntrinsicElements["form"], "onSubmit"> {
  loading: boolean;
  onSubmit: (value: PasswordFormValue) => void;
  disabled?: boolean;
  error?: FirebaseError;
}

export function PasswordForm({ children, loading, disabled, error, onSubmit }: PasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isHidden, setIsHidden] = React.useState(true);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Email address" required disabled={disabled} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input type={isHidden ? "password" : "text"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Password" required minLength={8} disabled={disabled} />
            <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              {isHidden ? <span className="material-icons">visibility</span> : <span className="material-icons">visibility_off</span>}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} disabled={loading || disabled}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div className="mt-4">{children}</div>
    </div>
  );
}
