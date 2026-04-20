# JWT and Authentication Implementation Documentation

This document provides a detailed overview of the authentication system implemented in the TaskFlow Next.js 16 frontend.

## 1. Architecture Overview

The authentication system is a hybrid model that leverages **Next.js 16 Server Components**, **Server Actions**, and **React 19 Hooks**. It uses JSON Web Tokens (JWT) for session management, stored securely in HTTP-only cookies to mitigate XSS (Cross-Site Scripting) risks.

### Key Technologies
- **Next.js 16 App Router**: For routing and server-side logic.
- **Server Actions**: To handle login, registration, and logout without client-side API routes.
- **HTTP-only Cookies**: For secure token storage.
- **React 19 `useActionState`**: For managing form state and transitions.

---

## 2. Token Storage Strategy

Authentication relies on two tokens:
1.  **`accessToken`**: Short-lived token used for authenticating API requests.
2.  **`refreshToken`**: Long-lived token used to obtain a new `accessToken` when it expires.

### Security Configuration
Both tokens are stored as cookies with the following attributes:
- `httpOnly: true`: Prevents client-side JavaScript from accessing the tokens.
- `secure`: Set to `true` in production (requires HTTPS).
- `sameSite: 'lax'`: Provides a balance between security and usability for cross-site requests.
- `path: '/'`: Ensures the tokens are available for all routes.

---

## 3. Core Utilities

### `lib/api.ts` - Transparent Token Refresh
The `getAccessToken()` function is the heart of the token management system. It performs the following steps:
1.  Retrieves the `accessToken` and `refreshToken` from the cookie store.
2.  If the `accessToken` is missing but a `refreshToken` exists, it proactively calls the `/token/refresh/` endpoint.
3.  If the refresh is successful, it updates the `accessToken` cookie and returns the new token.
4.  If the refresh fails, it clears both cookies and returns `null`, effectively logging the user out.

### `lib/auth-shared.ts` - Session Validation
- `validateSession()`: A server-side helper used in Server Actions to ensure a valid `accessToken` exists before proceeding with protected operations.
- `getUserProfile()`: Fetches the current user's details from the `/users/me/` endpoint using the `accessToken`.

---

## 4. Authentication Flows

### Registration (`app/register/actions.ts`)
1.  User submits the registration form.
2.  The `registerAction` sends a POST request to `${API_BASE_URL}/users/register/`.
3.  On success, the backend returns both `access` and `refresh` tokens.
4.  The action sets the tokens in cookies and redirects the user to `/todos`.

### Login (`app/login/actions.ts`)
1.  User submits credentials via the `LoginForm`.
2.  The `loginAction` calls the `/token/` endpoint.
3.  On successful authentication, it receives the tokens, stores them in cookies, and redirects to `/todos`.

### Logout (`lib/auth-shared.ts`)
1.  The `logout` action deletes both `accessToken` and `refreshToken` from the cookies.
2.  The user is redirected to the home page (`/`).

---

## 5. Client-Side Integration

### Global State Management
The `AuthProvider` (`context/auth-context.tsx`) wraps the application and provides access to the `user` object and `loading` state via the `useAuth` hook.

### Component-Level Handling
- **`RootLayout`**: Fetches the user profile server-side on initial load and passes it as `initialUser` to the `AuthProvider` to avoid layout shifts or "flash of unauthenticated state".
- **`useActionState`**: Used in login and register forms to handle loading states (`isPending`) and display server-side errors returned by the actions.

---

## 6. Protecting Routes and Actions

### Route Protection
Route protection is primarily handled in **Server Components** by checking the session state before rendering:
```typescript
const profile = await getUserProfile();
if (!profile.success) {
  redirect('/login');
}
```

### Action Protection
Every mutation (Add/Edit/Delete) in `app/todos/actions.ts` starts with a call to `validateSession()`:
```typescript
export async function addTodo(prevState: any, formData: FormData) {
  const session = await validateSession();
  if (!session.success) {
    return { success: false, error: session.error };
  }
  // Proceed with authorized API call using session.accessToken
}
```

---

## 7. Error Handling

The system handles multiple error layers:
1.  **Network Errors**: Caught via `try/catch` in Server Actions.
2.  **Validation Errors**: Structured error objects (e.g., `Record<string, string[]>`) are returned from the backend and displayed in the UI.
3.  **Authentication Errors**: 401 Unauthorized responses trigger the token refresh logic or redirect to login.
