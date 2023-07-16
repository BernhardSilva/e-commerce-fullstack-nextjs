```pnpm create next-app@latest ecommerce-admin --typescript --tailwind --eslint```

√ Would you like to use `src/` directory? ... No 
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to customize the default import alias? ... No

```cd ecommerce-admin/```

```npx shadcn-ui@latest init```

Ok to proceed? (y) y
√ Would you like to use TypeScript (recommended)? ... yes
√ Which style would you like to use? » Default
√ Which color would you like to use as base color? » Slate
√ Where is your global CSS file? ... app/globals.css
√ Would you like to use CSS variables for colors? ... yes
√ Where is your tailwind.config.js located? ... tailwind.config.js
√ Configure the import alias for components: ... @/components
√ Configure the import alias for utils: ... @/lib/utils
√ Are you using React Server Components? ... yes
√ Write configuration to components.json. Proceed? ... yes

```pnpm add @clerk/nextjs```

```npx shadcn-ui@latest add button```

```npx shadcn-ui@latest add dialog```

```npx shadcn-ui@latest add form```

```pnpm add zustand```