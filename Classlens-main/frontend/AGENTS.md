<!-- BEGIN:nextjs-agent-rules -->

# Next.js 16 Guidelines (App Router)

This document contains critical information about Next.js 16 that may differ from your training data. Always verify against the official Next.js 16 documentation.

## 1. Routing & Pages

- **App Router is Standard**: All new applications should use the App Router (`app/`).
- **Pages**: Create files inside `app/` directory.
  - File names determine the route path.
  - `page.tsx`: Renders a UI for a specific route.
  - `layout.tsx`: Defines shared UI for a group of pages.
  - `loading.tsx`: Shows loading state while content is loading.
  - `error.tsx`: Handles errors in the UI tree.
- **Nested Routes**: Create subdirectories inside `app/` to create nested routes.
- **Route Segments**: Folder names are part of the URL path.
  - Example: `app/dashboard/settings/page.tsx` -> `/dashboard/settings`
- **Special Files**:
  - `template.tsx`: UI that persists during navigation (state is preserved).
  - `not-found.tsx`: Custom 404 UI.
  - `global-error.tsx`: Global error boundary.

## 2. Data Fetching

- **Server Components by Default**: All components in the App Router are Server Components by default.
- **`async/await` in Components**: You can use `async/await` directly in Server Components.

```tsx
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()

  return (
    <main>
      <h1>{json.title}</h1>
    </main>
  )
}
```

- **Client Components**: Opt-in using `'use client'` at the top of the file.
- **Fetching Strategies**:
  - **Server Components**: Fetch data on the server before rendering.
  - **Client Components**: Fetch data using `useEffect`, `SWR`, or `TanStack Query`.
  - **Streaming**: Use `Suspense` for progressive rendering.

## 3. Rendering

- **Server Components**: Render on the server, produce HTML on the server, send to client.
- **Client Components**: Render on client (after initial server render), can be interactive.
- **Static Rendering** (Default): Pages are pre-rendered at build time.
- **Dynamic Rendering**: Pages render on-demand at request time.
  - Opt-in using `dynamic()` function or by using dynamic functions like `cookies()` or `headers()`.

```tsx
import { dynamic } from 'next/dynamic'

dynamic({
  loading: () => <Loader />,
})
```

## 4. Styling

- **Global CSS**: Import in `app/layout.tsx`.
- **Tailwind CSS v4**: Supported out of the box.
- **CSS Modules**: Supported (`.module.css`).
- **Scoped CSS**: CSS-in-JS libraries like `styled-components` or Emotion can be used.

## 5. Development

- **Development Server**: `npm run dev` or `yarn dev`
- **Build**: `npm run build` or `yarn build`
- **Start**: `npm run start` or `yarn start`

## 6. Important Notes

- **Breaking Changes**: Read `node_modules/next/dist/docs/` for detailed migration guides.
- **Deprecations**: Check for deprecation notices in the documentation.
- **Type Safety**: TypeScript is recommended. Use `npx tsc --init` to generate `tsconfig.json`.
- **Environment Variables**: Use `.env.local` for local development. Access via `process.env.MY_VAR`.

<!-- END:nextjs-agent-rules -->
