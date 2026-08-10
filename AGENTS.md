# AGENTS.md

Single-page React app that converts Java entity classes to example JSON. Pure client-side — no backend, no API calls, no env config.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (see Verification below)
- `npm run preview` — serve built `dist/`

There is intentionally **no** `test`, `lint`, or `format` script. Do not assume one exists.

## Verification

`npm run build` is the only verification step. It will fail on:

- unused locals, parameters, or imports (`noUnusedLocals`, `noUnusedParameters`)
- switch fallthrough
- any `strict`-mode type error

Clean up unused imports/vars before considering a change done.

## Toolchain — do not migrate to older patterns

- **Tailwind v4**: loaded via `@tailwindcss/vite` plugin (`vite.config.ts`) and `@import "tailwindcss"` in `src/index.css`. There is **no** `tailwind.config.js` and no PostCSS config on purpose — do not add one. Use Tailwind v4 CSS-based config if you need theming.
- **Recent major versions**: React 19, Vite 8, TypeScript 6, `@vitejs/plugin-react` 6. Do not downgrade.
- `package.json` has `"type": "module"` (ESM throughout) and `tsconfig.json` has `allowImportingTsExtensions: true` + `noEmit: true` — relative imports may use explicit `.ts`/`.tsx` extensions.

## Architecture

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.
- `src/core/` is **pure logic, no React imports**:
  - `parser.ts` — regex-based Java class parser (intentionally not a real Java grammar)
  - `typeDefaults.ts` — registry mapping Java primitive/wrapper/`java.time`/`BigDecimal` etc. to default JSON values; detects collection/map/array types by short name
  - `converter.ts` — orchestrates parse → resolve → emit; **recursion is depth-capped at 5** (deeper fields return `null`)
- `src/components/` — presentational React components. **All visible UI text is Chinese (zh-CN)** — match that when adding labels, placeholders, or errors.

## Parser behavior to preserve

The Java parser is intentionally regex-based. It handles:

- field lines matching `(private|protected|public) <type> <name>;`
- JSON-name override annotations **only**: `@JsonProperty`, `@SerializedName`, `@JSONField`
- generics: `List<T>`/`Set<T>`/`Collection<T>` and similar → single-element sample array; `Map<K,V>` → `{ "key": <sample V> }`; `T[]` arrays
- `import` resolution: simple class names are resolved to fully-qualified names via imports
- `serialVersionUID` is always skipped

Unknown referenced types are **not** errors — the field is omitted from output and a `ConversionWarning` is emitted telling the user to paste the referenced class in the "context" textarea. Keep this contract when extending.

If extending the parser, keep it regex-based unless explicitly asked to replace the approach — do not silently introduce a real Java parser dependency.
