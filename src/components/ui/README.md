# UI Components

This folder follows the **shadcn/ui** convention: reusable, accessible UI primitives and composed components live here.

- **Why `/components/ui`?**  
  Keeping UI building blocks in one place makes it easier to add shadcn components via CLI (`npx shadcn@latest add button`) and to keep design patterns consistent. The shadcn CLI expects this path by default.

- **Project setup:**  
  This app already uses **TypeScript**, **Tailwind CSS**, and the `@/*` path alias. To add more shadcn components, run:
  ```bash
  npx shadcn@latest init   # if not already done
  npx shadcn@latest add <component>
  ```
