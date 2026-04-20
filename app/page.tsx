import { getUserProfile, logout } from '@/lib/auth-shared';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { CheckCircle2, ListTodo, LogOut, ArrowRight, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function HomePage() {
  const profile = await getUserProfile();
  const user = profile.success ? profile.user : null;

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text">
      {/* Navigation */}
      <nav className="border-b border-ctp-surface0 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-ctp-blue p-1.5 rounded-lg">
            <CheckCircle2 suppressHydrationWarning className="h-6 w-6 text-ctp-base" />
          </div>
          <span className="font-bold text-xl tracking-tight text-ctp-text">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-ctp-subtext0 hidden sm:inline">
                {user.username}
              </span>
              <form action={logout}>
                <button type="submit" className="text-sm font-medium text-ctp-subtext1 hover:text-ctp-red transition-colors flex items-center gap-1">
                  <LogOut suppressHydrationWarning className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-ctp-subtext0 hover:text-ctp-blue transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-ctp-blue text-ctp-base text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm shadow-ctp-blue/20">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-ctp-blue/10 text-ctp-blue px-4 py-1.5 rounded-full text-sm font-medium border border-ctp-blue/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ctp-blue/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ctp-blue"></span>
            </span>
            Next.js 16 + Tailwind 4 Powered
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-ctp-text tracking-tight">
            Manage your daily <span className="text-ctp-blue">tasks</span> with ease.
          </h1>
          
          <p className="text-lg md:text-xl text-ctp-subtext1 leading-relaxed max-w-2xl mx-auto">
            The minimal, high-performance todo application designed to help you stay organized and boost your productivity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <Link href="/todos" className="group bg-ctp-blue text-ctp-base text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-ctp-blue/20 hover:scale-105 active:scale-95">
                Go to Dashboard
                <ArrowRight suppressHydrationWarning className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link href="/register" className="group bg-ctp-blue text-ctp-base text-lg font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-ctp-blue/20 hover:scale-105 active:scale-95">
                  Sign Up for Free
                  <ArrowRight suppressHydrationWarning className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/login" className="text-ctp-text text-lg font-semibold px-8 py-4 rounded-xl hover:bg-ctp-mantle border border-ctp-surface0 transition-all">
                  Already a member?
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-ctp-surface0 bg-ctp-mantle shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-ctp-blue/10 p-3 rounded-xl w-fit">
              <ListTodo suppressHydrationWarning className="h-6 w-6 text-ctp-blue" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ctp-text">Stay Organized</h3>
            <p className="mt-2 text-ctp-subtext1 italic">"Simplicity is the ultimate sophistication."</p>
          </div>
          <div className="p-8 rounded-2xl border border-ctp-surface0 bg-ctp-mantle shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-ctp-green/10 p-3 rounded-xl w-fit">
              <CheckCircle2 suppressHydrationWarning className="h-6 w-6 text-ctp-green" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ctp-text">Track Progress</h3>
            <p className="mt-2 text-ctp-subtext1">Mark tasks complete and keep moving forward with our intuitive interface.</p>
          </div>
          <div className="p-8 rounded-2xl border border-ctp-surface0 bg-ctp-mantle shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-ctp-mauve/10 p-3 rounded-xl w-fit">
              <Github suppressHydrationWarning className="h-6 w-6 text-ctp-mauve" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ctp-text">Modern Stack</h3>
            <p className="mt-2 text-ctp-subtext1">Built with the latest technologies including Next.js 16 and Tailwind CSS 4.</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-ctp-surface0 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-ctp-subtext0 text-sm">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
