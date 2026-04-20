import { getTodos } from './actions';
import TodoForm from './todo-form';
import TodoItem from './todo-item';
import { ListTodo, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/lib/auth-shared';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function TodosPage() {
  const result = await getTodos();
  const todos = result.success ? result.todos : [];
  const error = result.error;

  return (
    <div className="min-h-screen bg-ctp-base text-ctp-text">
      {/* Top Header */}
      <header className="bg-ctp-mantle border-b border-ctp-surface0 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-ctp-surface0 rounded-full transition-colors">
              <ArrowLeft suppressHydrationWarning className="h-5 w-5 text-ctp-subtext1" />
            </Link>
            <div className="bg-ctp-blue p-1.5 rounded-lg hidden sm:block">
              <CheckCircle2 suppressHydrationWarning className="h-5 w-5 text-ctp-base" />
            </div>
            <h1 className="text-xl font-bold text-ctp-text tracking-tight">Your Tasks</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={logout}>
              <button className="flex items-center gap-2 text-sm font-medium text-ctp-subtext1 hover:text-ctp-red transition-colors py-2 px-4 rounded-lg hover:bg-ctp-red/10">
                <LogOut suppressHydrationWarning className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats Summary */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="bg-ctp-mantle p-4 rounded-xl border border-ctp-surface0 shadow-sm">
            <p className="text-sm font-medium text-ctp-subtext1">Total Tasks</p>
            <p className="text-2xl font-bold text-ctp-text">{todos?.length || 0}</p>
          </div>
          <div className="bg-ctp-mantle p-4 rounded-xl border border-ctp-surface0 shadow-sm">
            <p className="text-sm font-medium text-ctp-subtext1">Completed</p>
            <p className="text-2xl font-bold text-ctp-green">
              {todos?.filter(t => t.completed).length || 0}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-ctp-red/10 border border-ctp-red/20 text-ctp-red rounded-xl text-sm font-medium flex items-center gap-2">
            <span className="bg-ctp-red/20 p-1 rounded-full">!</span>
            {error}
          </div>
        )}

        <TodoForm />

        <div className="space-y-3">
          {todos?.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}

          {todos?.length === 0 && !error && (
            <div className="text-center py-20 bg-ctp-mantle rounded-2xl border-2 border-dashed border-ctp-surface0">
              <div className="bg-ctp-base p-4 rounded-full w-fit mx-auto mb-4">
                <ListTodo suppressHydrationWarning className="h-10 w-10 text-ctp-surface2" />
              </div>
              <h3 className="text-lg font-semibold text-ctp-text">No tasks yet</h3>
              <p className="text-ctp-subtext1 mt-1 max-w-xs mx-auto">
                Time to start organizing! Add your first todo using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
