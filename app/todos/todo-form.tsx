'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addTodo } from './actions';
import { Plus, Loader2, TextQuote, Heading2 } from 'lucide-react';

export default function TodoForm() {
  const [state, action, isPending] = useActionState(addTodo, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="bg-ctp-mantle p-6 rounded-xl shadow-sm border border-ctp-surface0 mb-8">
      <h2 className="text-lg font-bold text-ctp-text mb-4 flex items-center gap-2">
        <Plus suppressHydrationWarning className="h-5 w-5 text-ctp-blue" />
        Add New Task
      </h2>
      
      <form ref={formRef} action={action} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ctp-subtext1" htmlFor="title">
            Title
          </label>
          <div className="relative">
            <Heading2 suppressHydrationWarning className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ctp-overlay0" />
            <input
              id="title"
              name="title"
              placeholder="What needs to be done?"
              required
              className="flex h-10 w-full rounded-lg border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ctp-subtext1" htmlFor="description">
            Description (Optional)
          </label>
          <div className="relative">
            <TextQuote suppressHydrationWarning className="absolute left-3 top-3 h-4 w-4 text-ctp-overlay0" />
            <textarea
              id="description"
              name="description"
              placeholder="Add some details..."
              rows={2}
              className="flex w-full rounded-lg border border-ctp-surface0 bg-ctp-base px-9 py-2 text-sm text-ctp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue transition-all shadow-sm resize-none"
            />
          </div>
        </div>

        {state?.error && (
          <p className="text-sm text-ctp-red bg-ctp-red/10 p-2 rounded-md border border-ctp-red/20">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-blue disabled:pointer-events-none disabled:opacity-50 bg-ctp-blue text-ctp-base hover:opacity-90 h-10 px-6 shadow-md shadow-ctp-blue/20 active:scale-95"
        >
          {isPending ? (
            <Loader2 suppressHydrationWarning className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus suppressHydrationWarning className="mr-2 h-4 w-4" />
          )}
          Add Task
        </button>
      </form>
    </div>
  );
}
