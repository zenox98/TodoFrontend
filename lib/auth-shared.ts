'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/');
}

export async function getUserProfile() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch profile' };
    }

    const user = await response.json();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: `failed to fetch profile ${error}` };
  }
}

/**
 * Strict validation helper for Server Actions.
 * Ensures the user has a valid access token (or refreshes it).
 * Returns the access token or throws/returns an error.
 */
export async function validateSession() {
  const { getAccessToken } = await import('./api');
  const accessToken = await getAccessToken();
  
  if (!accessToken) {
    return { success: false, error: 'Session expired or invalid. Please login again.' };
  }
  
  return { success: true, accessToken };
}
