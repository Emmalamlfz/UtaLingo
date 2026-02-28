# UtaLingo

An app that helps Japanese learners to learn from songs.

## Cursor Cloud specific instructions

### Tech Stack
- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm (lockfile: `pnpm-lock.yaml`)

### Common Commands
See `package.json` scripts:
- `pnpm dev` — starts dev server on port 3000
- `pnpm build` — production build
- `pnpm lint` — runs ESLint
- `pnpm test` — runs Vitest (all tests under `src/**/*.test.{ts,tsx}`)
- `pnpm test:watch` — runs Vitest in watch mode

### Notes
- Vitest requires explicit `cleanup()` in `src/test/setup.ts` after each test (already configured). Without it, React Testing Library accumulates DOM between tests causing duplicate-element errors.
- The `pnpm.onlyBuiltDependencies` field in `package.json` allows `esbuild` to run its postinstall script (needed by Vitest). Do not remove it.
- Path alias `@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
