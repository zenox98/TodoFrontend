'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { validateSession } from '@/lib/auth-shared';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user: number;
}

export async function getTodos(): Promise<{ success: boolean; todos?: Todo[]; error?: string }> {
  const session = await validateSession();

  if (!session.success) {
    return { success: false, error: session.error };
  }

  const response = await fetch(`${API_BASE_URL}/todo/`, {
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
    next: { tags: ['todos'] }, // Tag for revalidation
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Cannot clear cookies in a Server Component rendering context, so just redirect
      redirect('/login');
    }
    return { success: false, error: `Failed to fetch todos: ${response.statusText}` };
  }

  const todos: Todo[] = await response.json();
  return { success: true, todos };
}

export type TodoActionState = {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function addTodo(prevState: TodoActionState, formData: FormData): Promise<TodoActionState> {
  const session = await validateSession();

  if (!session.success) {
    return { success: false, error: session.error };
  }
  
  const accessToken = session.accessToken;

  const title = formData.get('title');
  const description = formData.get('description');

  if (!title) {
    return { success: false, error: 'Title is required' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/todo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        return { success: false, error: data.detail || 'Failed to add todo', errors: data };
      } catch (e) {
        return { success: false, error: 'Failed to add todo: Server error' };
      }
    }

    const data = await response.json();

    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function toggleTodoCompletion(id: number, completed: boolean): Promise<{ success: boolean; error?: string }> {
  const session = await validateSession();

  if (!session.success) {
    return { success: false, error: session.error };
  }
  
  const accessToken = session.accessToken;

  const response = await fetch(`${API_BASE_URL}/todo/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    try {
      const data = await response.json();
      return { success: false, error: data.detail || 'Failed to update todo' };
    } catch (e) {
      return { success: false, error: 'Failed to update todo: Server error' };
    }
  }

  revalidatePath('/todos');
  return { success: true };
}

export async function updateTodo(id: number, prevState: TodoActionState, formData: FormData): Promise<TodoActionState> {
  const session = await validateSession();

  if (!session.success) {
    return { success: false, error: session.error };
  }
  
  const accessToken = session.accessToken;

  const title = formData.get('title');
  const description = formData.get('description');

  if (!title) {
    return { success: false, error: 'Title is required' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/todo/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        return { success: false, error: data.detail || 'Failed to update todo', errors: data };
      } catch (e) {
        return { success: false, error: 'Failed to update todo: Server error' };
      }
    }

    const data = await response.json();

    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteTodo(id: number): Promise<{ success: boolean; error?: string }> {
  const session = await validateSession();

  if (!session.success) {
    return { success: false, error: session.error };
  }
  
  const accessToken = session.accessToken;

  const response = await fetch(`${API_BASE_URL}/todo/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    try {
      const data = await response.json();
      return { success: false, error: data.detail || 'Failed to delete todo' };
    } catch (e) {
      return { success: false, error: 'Failed to delete todo' };
    }
  }

  revalidatePath('/todos');
  return { success: true };
}
