'use client';

import { useActionState } from 'react';
import { registerAction } from './actions';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const [state, action, isPending] = useActionState(registerAction, { success: false });

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
        {state?.errors?.username && (
          <p className="text-xs text-ctp-red mt-1">{state.errors.username[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none text-ctp-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail suppressHydrationWarning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ctp-overlay0" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="flex h-10 w-full rounded-md border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {state?.errors?.email && (
          <p className="text-xs text-ctp-red mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          {state?.errors?.password && (
            <p className="text-xs text-ctp-red mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-ctp-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password2">
            Confirm
          </label>
          <div className="relative">
            <Lock suppressHydrationWarning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ctp-overlay0" />
            <input
              id="password2"
              name="password2"
              type="password"
              placeholder="••••••••"
              required
              className="flex h-10 w-full rounded-md border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
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
          <UserPlus suppressHydrationWarning className="mr-2 h-4 w-4" />
        )}
        Create Account
      </button>

      <div className="text-center text-sm text-ctp-subtext1">
        Already have an account?{' '}
        <Link href="/login" className="text-ctp-blue hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}
