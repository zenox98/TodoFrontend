import LoginForm from './login-form';
import { CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ctp-base px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-ctp-mantle p-8 rounded-xl shadow-lg border border-ctp-surface0">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-ctp-blue/10 p-3 rounded-full">
              <CheckCircle2 suppressHydrationWarning className="h-8 w-8 text-ctp-blue" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-ctp-text">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-ctp-subtext1">
            Sign in to manage your tasks
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
