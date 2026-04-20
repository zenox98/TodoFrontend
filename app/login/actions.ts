'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/api';
import { redirect } from 'next/navigation';

export type LoginActionState = {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function loginAction(prevState: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const username = formData.get('username');
  const password = formData.get('password');

  if (!username || !password) {
    return { success: false, error: 'Please enter both username and password' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        return { success: false, error: data.detail || 'Login failed' };
      } catch (e) {
        return { success: false, error: 'Invalid credentials or server error' };
      }
    }

    const data = await response.json();

    const cookieStore = await cookies();
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
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }

  redirect('/todos');
}
