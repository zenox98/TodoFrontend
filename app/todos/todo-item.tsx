'use client';

import { useActionState, useEffect, useState } from 'react';
import { toggleTodoCompletion, deleteTodo, updateTodo } from './actions';
import { Trash2, CheckCircle, Circle, Loader2, AlertCircle, Pencil, Check, X } from 'lucide-react';

interface TodoItemProps {
  todo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  };
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useActionState for inline update
  const [updateState, updateAction, isUpdating] = useActionState(
    (prevState: any, formData: FormData) => updateTodo(todo.id, prevState, formData),
    { success: false }
  );

  useEffect(() => {
    if (updateState.success) {
      setIsEditing(false);
    }
    if (updateState.error) {
      setError(updateState.error);
    }
  }, [updateState.success, updateState.error]);

  const handleToggle = async () => {
    if (isEditing) return; // Disable toggle in edit mode
    setError(null);
    setIsToggling(true);
    const result = await toggleTodoCompletion(todo.id, !isCompleted);
    if (result.success) {
      setIsCompleted(!isCompleted);
    } else {
      setError(result.error || 'Failed to update task');
    }
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (isEditing) return;
    setError(null);
    setIsDeleting(true);
    const result = await deleteTodo(todo.id);
    if (!result.success) {
      setError(result.error || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-xl border border-ctp-blue bg-ctp-mantle shadow-lg shadow-ctp-blue/5">
        <form action={updateAction} className="space-y-3">
          <div className="space-y-1">
            <input
              name="title"
              defaultValue={todo.title}
              required
              autoFocus
              className="w-full bg-ctp-base border border-ctp-surface0 rounded-lg px-3 py-2 text-sm font-semibold text-ctp-text focus:outline-none focus:ring-2 focus:ring-ctp-blue"
              placeholder="Task title"
            />
          </div>
          <div className="space-y-1">
            <textarea
              name="description"
              defaultValue={todo.description}
              rows={2}
              className="w-full bg-ctp-base border border-ctp-surface0 rounded-lg px-3 py-2 text-sm text-ctp-subtext1 focus:outline-none focus:ring-2 focus:ring-ctp-blue resize-none"
              placeholder="Add details..."
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ctp-blue text-ctp-base text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm shadow-ctp-blue/20"
              >
                {isUpdating ? <Loader2 suppressHydrationWarning className="h-3.5 w-3.5 animate-spin" /> : <Check suppressHydrationWarning className="h-3.5 w-3.5" />}
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ctp-surface0 text-ctp-text text-xs font-bold hover:bg-ctp-surface1 transition-all"
              >
                <X suppressHydrationWarning className="h-3.5 w-3.5" />
                Cancel
              </button>
            </div>
            
            {error && (
              <div className="text-xs text-ctp-red font-medium flex items-center gap-1">
                <AlertCircle suppressHydrationWarning className="h-3 w-3" />
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 bg-ctp-mantle ${
      isCompleted ? 'border-ctp-surface0 bg-ctp-base/50' : 'border-ctp-surface1 shadow-sm hover:border-ctp-blue/50'
    }`}>
      <button
        onClick={handleToggle}
        disabled={isToggling || isDeleting}
        className="mt-1 transition-transform active:scale-90"
      >
        {isToggling ? (
          <Loader2 suppressHydrationWarning className="h-5 w-5 animate-spin text-ctp-blue" />
        ) : isCompleted ? (
          <CheckCircle suppressHydrationWarning className="h-5 w-5 text-ctp-green" />
        ) : (
          <Circle suppressHydrationWarning className="h-5 w-5 text-ctp-surface2 group-hover:text-ctp-blue" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-ctp-text transition-all truncate ${
          isCompleted ? 'line-through text-ctp-overlay0 decoration-ctp-surface2' : ''
        }`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`mt-1 text-sm transition-all break-words ${
            isCompleted ? 'text-ctp-overlay0' : 'text-ctp-subtext1'
          }`}>
            {todo.description}
          </p>
        )}
        
        {error && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-ctp-red font-medium">
            <AlertCircle suppressHydrationWarning className="h-3.5 w-3.5" />
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isDeleting || isToggling}
          className="p-2 text-ctp-overlay0 hover:text-ctp-blue hover:bg-ctp-blue/10 rounded-lg transition-colors disabled:opacity-50"
          title="Edit task"
        >
          <Pencil suppressHydrationWarning className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
          className="p-2 text-ctp-overlay0 hover:text-ctp-red hover:bg-ctp-red/10 rounded-lg transition-colors disabled:opacity-50"
          title="Delete task"
        >
          {isDeleting ? (
            <Loader2 suppressHydrationWarning className="h-5 w-5 animate-spin" />
          ) : (
            <Trash2 suppressHydrationWarning className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
