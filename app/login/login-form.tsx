'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import { User, Lock, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, { success: false });

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-ctp-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
          Username
        </label>
        <div className="relative">
          <User suppressHydrationWarning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ctp-overlay0" />
          <input
            id="username"
            name="username"
            placeholder="johndoe"
            required
            className="flex h-10 w-full rounded-md border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-ctp-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock suppressHydrationWarning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ctp-overlay0" />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="flex h-10 w-full rounded-md border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-ctp-red bg-ctp-red/10 rounded-md border border-ctp-red/20">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:pointer-events-none disabled:opacity-50 bg-ctp-blue text-ctp-base hover:opacity-90 h-10 px-4 py-2 w-full shadow-sm shadow-ctp-blue/20"
      >
        {isPending ? (
          <Loader2 suppressHydrationWarning className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn suppressHydrationWarning className="mr-2 h-4 w-4" />
        )}
        Sign In
      </button>

      <div className="text-center text-sm text-ctp-subtext1">
        Don't have an account?{' '}
        <Link href="/register" className="text-ctp-blue hover:underline">
          Create one now
        </Link>
      </div>
    </form>
  );
}
