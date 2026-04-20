'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/api';
import { redirect } from 'next/navigation';

export type RegisterActionState = {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function registerAction(prevState: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const password2 = formData.get('password2');

  if (!username || !email || !password || !password2) {
    return { success: false, error: 'Please fill in all fields' };
  }

  if (password !== password2) {
    return { success: false, error: 'Passwords do not match' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, password2 }),
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        if (typeof data === 'object' && !Array.isArray(data)) {
          return { success: false, errors: data as Record<string, string[]>, error: 'Please correct the errors below' };
        }
      } catch {
        return { success: false, error: 'Registration failed due to server error' };
      }
      return { success: false, error: 'Registration failed' };
    }

    const data = await response.json();

    const cookieStore = await cookies();
    if (data.access && data.refresh) {
      cookieStore.set('accessToken', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      cookieStore.set('refreshToken', data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
    }
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/todos');
}
