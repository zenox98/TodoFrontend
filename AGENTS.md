<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TaskFlow Development Guide

This document provides essential information for agents working on the TaskFlow frontend codebase.

## 🛠 Commands

| Action | Command |
| :--- | :--- |
| **Development** | `pnpm dev` |
| **Build** | `pnpm build` |
| **Lint** | `pnpm lint` |
| **Start** | `pnpm start` |

*Note: The project currently does not have a configured testing framework. If adding tests, prefer Vitest or Playwright.*

## 📐 Code Style & Conventions

### 📂 File Structure
- **Routes:** Located in `app/`. Use dedicated directories for routes (e.g., `app/login/page.tsx`).
- **Actions:** Use route-specific `actions.ts` files for Server Actions.
- **Components:** Place shared components in `components/` (if created) or keep them route-specific if only used once.
- **Utilities:** Shared logic belongs in `lib/` (e.g., `lib/api.ts`, `lib/auth-shared.ts`).

### ⌨️ Naming Conventions
- **Filenames:** Use **kebab-case** (e.g., `todo-item.tsx`, `login-form.tsx`).
- **Components:** Use **PascalCase** (e.g., `TodoItem`, `LoginForm`).
- **Functions/Variables:** Use **camelCase**.
- **Server Actions:** Append `Action` to the name if needed for clarity (e.g., `loginAction`), or use descriptive verbs (e.g., `addTodo`).

### 🧩 Components & Hooks
- Use **functional components** and **React 19** hooks.
- **Server Components:** Default. Use for data fetching and layout structure.
- **Client Components:** Use `'use client'` strictly for interactivity, hooks (`useState`, `useActionState`), or browser APIs.
- **Server Actions:** Use `'use server'` at the top of action files.

### 📦 Imports
- Use the `@/` alias for absolute imports from the project root.
- **Order:**
    1.  React/Next.js core imports.
    2.  Third-party libraries (e.g., `lucide-react`).
    3.  Internal components/actions.
    4.  Internal utilities/types.
    5.  Styles (if local).

### 🏷 Types
- Use **TypeScript** for all new code.
- Define explicit interfaces/types for API responses and action states.
- Example Action State:
    ```typescript
    export type ActionState = {
      success: boolean;
      error?: string;
      errors?: Record<string, string[]>;
    };
    ```

### 💅 Styling
- Use **Tailwind CSS 4**.
- Adhere to the established **card-based design system**:
    - `rounded-xl` for cards and containers.
    - `shadow-sm` or `shadow-lg` for elevation.
    - `border-gray-100` or `border-gray-200` for subtle borders.
    - `bg-white` or `bg-gray-50/50` for backgrounds.
- Prefer utility classes over inline styles or CSS modules.
- Use Lucide icons for visual consistency (`lucide-react`).

### 🚨 Error Handling
- Use `try/catch` blocks in Server Actions to catch network or parsing errors.
- Always check `response.ok` when using `fetch`.
- Return structured error objects to the client for graceful UI feedback.
- Example pattern:
    ```typescript
    try {
      const response = await fetch(...);
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.detail || 'Generic error' };
      }
      // ... process success
    } catch (e) {
      return { success: false, error: 'Network failure' };
    }
    ```
- Use `revalidatePath()` or `revalidateTag()` after mutations to keep the UI in sync.

### 🔐 Authentication
- JWT tokens are stored in **HTTP-only cookies** (`accessToken`, `refreshToken`).
- Use the `getAccessToken()` helper from `@/lib/api.ts` to handle transparent token refreshing.
- Protect routes by checking for the `accessToken` in Server Components or using middleware.
- In Server Actions, always re-validate the token using `getAccessToken()` before making authenticated API calls.

## 📝 Best Practices

### 1. Separation of Concerns
- Keep UI components purely presentational where possible.
- Extract complex logic into Server Actions or utility functions in `lib/`.
- Use `useActionState` (React 19) to manage form state and transition states (isPending).

### 2. Performance & Optimization
- Fetch data in Server Components as high up the tree as possible to minimize waterfalls.
- Use `next/image` for optimized image delivery.
- Leverage `revalidatePath` to ensure fresh data without a full page reload.

### 3. Accessibility & Semantics
- Use semantic HTML tags (`main`, `nav`, `header`, `footer`, `section`, `article`).
- Ensure all interactive elements have proper `aria-labels` or visible labels.
- Use Lucide icons as decorative elements (they default to `aria-hidden="true"`).

### 4. Git Protocol (for Agents)
- Analyze existing code patterns before implementing new features.
- Run `pnpm lint` and `pnpm build` before finalizing changes.
- Provide concise, descriptive commit messages when requested.
