import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        try {
          const data = await response.json();
          try {
            cookieStore.set('accessToken', data.access, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              sameSite: 'lax',
            });
          } catch(err) {}
          return data.access;
        } catch (e) {
          console.error('Failed to parse refresh token response:', e);
          try { cookieStore.delete('accessToken'); } catch(err) {}
          try { cookieStore.delete('refreshToken'); } catch(err) {}
          return null;
        }
      } else {
        try { cookieStore.delete('accessToken'); } catch(err) {}
        try { cookieStore.delete('refreshToken'); } catch(err) {}
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
  return accessToken;
}
