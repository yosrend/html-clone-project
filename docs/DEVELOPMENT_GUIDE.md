# Development Guide

## Quick Start

### 1. Clone & Install
```bash
cd "/Users/yoseprendi/Vibe Coding/bistrochat-email-generator"
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local dengan credentials Anda
```

### 3. Database Setup
```bash
# Push schema ke Turso
npx drizzle-kit push

# Optional: Seed data
npx drizzle-kit seed
```

### 4. Run Development Server
```bash
npm run dev
```

Server akan berjalan di: http://localhost:3000

## Development Workflow

### Project Structure Best Practices

#### Components
- Letakkan reusable components di `src/components/`
- Gunakan TypeScript untuk type safety
- Follow naming convention: PascalCase untuk components

#### API Routes
- Structure: `src/app/api/[resource]/route.ts`
- Gunakan HTTP methods: GET, POST, PUT, DELETE
- Return JSON response dengan proper status codes

#### Database Operations
- Import schema dari `@/db/schema`
- Gunakan Drizzle ORM untuk queries
- Handle errors dengan try-catch

### Code Style

#### TypeScript
```typescript
// Good ✅
interface SignatureData {
  name: string;
  title: string;
  imageUrl?: string;
}

export async function createSignature(data: SignatureData) {
  // implementation
}

// Avoid ❌
export async function createSignature(data: any) {
  // implementation
}
```

#### React Components
```tsx
// Good ✅
export default function MyComponent({ title }: { title: string }) {
  return <div>{title}</div>;
}

// With types
interface Props {
  title: string;
  description?: string;
}

export default function MyComponent({ title, description }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

#### Database Queries
```typescript
// Good ✅
import { db } from '@/db';
import { signatures } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getSignature(id: number) {
  try {
    const result = await db
      .select()
      .from(signatures)
      .where(eq(signatures.id, id))
      .limit(1);
    return result[0];
  } catch (error) {
    console.error('Error fetching signature:', error);
    throw error;
  }
}
```

## Common Tasks

### Adding New Components

1. Create component file:
```bash
touch src/components/MyNewComponent.tsx
```

2. Implement component:
```tsx
import { useState } from 'react';

interface MyNewComponentProps {
  title: string;
}

export default function MyNewComponent({ title }: MyNewComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

3. Use in page:
```tsx
import MyNewComponent from '@/components/MyNewComponent';

export default function Page() {
  return <MyNewComponent title="Hello" />;
}
```

### Adding New API Endpoint

1. Create route file:
```bash
mkdir -p src/app/api/my-endpoint
touch src/app/api/my-endpoint/route.ts
```

2. Implement handlers:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Your logic here
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Adding Database Table

1. Update schema:
```typescript
// src/db/schema.ts
export const myNewTable = sqliteTable('my_new_table', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
});
```

2. Push to database:
```bash
npx drizzle-kit push
```

### Installing New Packages

```bash
# Dependencies
npm install package-name

# Dev dependencies
npm install -D package-name

# Specific version
npm install package-name@1.0.0
```

### Using Shadcn Components

```bash
# Add specific component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Use in your code
import { Button } from '@/components/ui/button';
```

## Debugging

### Browser DevTools
- Console: Command + Option + J (Mac)
- Network: Check API requests/responses
- React DevTools: Install extension

### VS Code Debugging
1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

2. Set breakpoints in code
3. Press F5 to start debugging

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

#### Database Connection Issues
```bash
# Check environment variables
cat .env.local

# Test connection
npx drizzle-kit introspect
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Check TypeScript errors
npx tsc --noEmit
```

## Testing

### Manual Testing Checklist

#### Email Signature Generator
- [ ] Form validation works
- [ ] Image upload and crop works
- [ ] Social media links are valid
- [ ] Preview updates in real-time
- [ ] Copy HTML works
- [ ] Save signature works
- [ ] Load signature works
- [ ] Theme toggle works

#### API Endpoints
- [ ] GET requests return data
- [ ] POST creates new records
- [ ] PUT updates records
- [ ] DELETE removes records
- [ ] Error handling works
- [ ] Validation works

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

// Use Next.js Image component
<Image
  src="/path/to/image.jpg"
  width={500}
  height={300}
  alt="Description"
  loading="lazy"
/>
```

### Code Splitting
```tsx
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### Database Optimization
```typescript
// Use indexes
export const signatures = sqliteTable('signatures', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
}, (table) => ({
  nameIdx: index('name_idx').on(table.name),
}));

// Limit queries
const results = await db
  .select()
  .from(signatures)
  .limit(10);
```

## Deployment Checklist

- [ ] Update environment variables
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Check all API endpoints work
- [ ] Test image uploads
- [ ] Verify database connection
- [ ] Check error handling
- [ ] Test on different browsers
- [ ] Test responsive design
- [ ] Review security settings

## Git Workflow

### Commit Messages
```bash
# Good commit messages
git commit -m "feat: Add signature export feature"
git commit -m "fix: Fix image upload validation"
git commit -m "docs: Update README with setup instructions"
git commit -m "refactor: Simplify database queries"
```

### Before Committing
```bash
# Check status
git status

# Review changes
git diff

# Stage files
git add .

# Commit
git commit -m "your message"
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
